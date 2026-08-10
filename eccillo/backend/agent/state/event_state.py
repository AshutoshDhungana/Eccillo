"""The structured event object and the manager that mediates all access to it.

This is the concrete implementation of spec §1 ("AI should never own state") and
§Structured Event Model.  The LLM never mutates these objects directly — it
proposes values, and the :class:`EventStateManager` applies them through typed,
audited operations backed by a pluggable store.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any

from pydantic import BaseModel, Field

from ..errors import ValidationError
from .machine import EventState, assert_transition

# Fields the orchestrator treats as "core" when deciding whether enough is known
# to leave COLLECTING_INFO and start PLANNING.  Priority order matters for the
# clarification strategy (spec §Clarification Strategy).
REQUIRED_CORE_FIELDS = ["event_type", "title", "guest_count", "date", "budget"]

VALID_EVENT_TYPES = {"birthday", "wedding", "conference", "hackathon", "festival", "workshop", "sports", "meetup", "seminar", "other"}


class TimelineItem(BaseModel):
    title: str
    offset_days: int = 0  # days relative to event date (negative = before)
    due_at: str | None = None
    critical_path: bool = False
    source: str = "ai"


class BudgetLine(BaseModel):
    category: str
    label: str = ""
    planned_minor: int = 0
    currency: str = "NPR"
    source: str = "ai"


class VendorRef(BaseModel):
    vendor_id: str
    name: str
    category: str
    score: float = 0.0
    reasons: list[str] = Field(default_factory=list)
    status: str = "shortlisted"  # shortlisted | proposed | booked


class TaskItem(BaseModel):
    title: str
    status: str = "todo"
    due_at: str | None = None
    depends_on: str | None = None
    source: str = "ai"


class GuestSegment(BaseModel):
    label: str
    count: int = 0
    channel: str = "email"


class StructuredEvent(BaseModel):
    """Persistent, structured representation of one event (lives forever)."""

    event_id: str = Field(default_factory=lambda: uuid.uuid4().hex)
    organization_id: str | None = None
    organizer_id: str | None = None

    event_type: str | None = None
    title: str | None = None
    description: str = ""

    budget: int | None = None  # minor units, matching backend budget_target_minor
    currency: str = "NPR"
    date: str | None = None  # ISO date string
    end_date: str | None = None
    timezone: str = "Asia/Kathmandu"
    guest_count: int | None = None
    venue: str | None = None
    location: str | None = None

    requirements: list[str] = Field(default_factory=list)
    timeline: list[TimelineItem] = Field(default_factory=list)
    budget_lines: list[BudgetLine] = Field(default_factory=list)
    vendors: list[VendorRef] = Field(default_factory=list)
    tasks: list[TaskItem] = Field(default_factory=list)
    guests: list[GuestSegment] = Field(default_factory=list)
    risks: list[dict[str, Any]] = Field(default_factory=list)
    notes: list[str] = Field(default_factory=list)

    status: EventState = EventState.DRAFT
    revision: int = 0
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    def missing_core_fields(self) -> list[str]:
        missing = []
        for name in REQUIRED_CORE_FIELDS:
            value = getattr(self, name)
            if value in (None, "", 0):
                missing.append(name)
        return missing

    def snapshot(self) -> dict[str, Any]:
        """A compact dict for prompt composition and explainability."""
        return self.model_dump(mode="json")


class EventStateStore:
    """Persistence port for structured events.

    The default implementation is in-memory; a future phase swaps in an
    ORM-backed store (writing to ``planning.Event`` + child tables) without the
    orchestrator or skills changing at all.
    """

    def __init__(self) -> None:
        self._events: dict[str, StructuredEvent] = {}

    def get(self, event_id: str) -> StructuredEvent | None:
        return self._events.get(event_id)

    def save(self, event: StructuredEvent) -> StructuredEvent:
        self._events[event.event_id] = event
        return event

    def all(self) -> list[StructuredEvent]:
        return list(self._events.values())


class EventStateManager:
    """The single authorized path for reading and mutating event state."""

    def __init__(self, store: EventStateStore | None = None):
        self.store = store or EventStateStore()

    # -- lifecycle -----------------------------------------------------------
    def create(self, **initial: Any) -> StructuredEvent:
        event = StructuredEvent(**initial)
        event.status = EventState.DRAFT
        return self.store.save(event)

    def get(self, event_id: str) -> StructuredEvent:
        event = self.store.get(event_id)
        if event is None:
            raise ValidationError("Unknown event_id", details={"event_id": event_id})
        return event

    # -- field updates -------------------------------------------------------
    def apply_fields(self, event_id: str, fields: dict[str, Any]) -> StructuredEvent:
        """Apply extracted/scalar fields with light coercion + validation.

        Ignores unknown keys (the LLM sometimes hallucinates field names) and
        rejects clearly invalid values rather than corrupting state.
        """
        event = self.get(event_id)
        allowed = set(StructuredEvent.model_fields) - {"event_id", "revision", "updated_at", "status"}
        changed = False
        for key, value in (fields or {}).items():
            if key not in allowed or value in (None, ""):
                continue
            if key == "event_type" and value not in VALID_EVENT_TYPES:
                value = "other"
            if key in {"budget", "guest_count"}:
                try:
                    value = int(value)
                except (TypeError, ValueError):
                    continue
                if value < 0:
                    continue
            setattr(event, key, value)
            changed = True
        if changed:
            self._bump(event)
        return event

    def append(self, event_id: str, field: str, items: list[Any]) -> StructuredEvent:
        """Append validated child records (timeline, budget_lines, vendors, ...)."""
        event = self.get(event_id)
        model_map = {
            "timeline": TimelineItem,
            "budget_lines": BudgetLine,
            "vendors": VendorRef,
            "tasks": TaskItem,
            "guests": GuestSegment,
        }
        current = getattr(event, field, None)
        if not isinstance(current, list):
            raise ValidationError(f"{field} is not an appendable collection")
        model = model_map.get(field)
        for item in items:
            if model is not None:
                current.append(model.model_validate(item) if not isinstance(item, model) else item)
            else:
                current.append(item)
        self._bump(event)
        return event

    def replace(self, event_id: str, field: str, items: list[Any]) -> StructuredEvent:
        setattr(self.get(event_id), field, [])
        return self.append(event_id, field, items)

    # -- state transitions ---------------------------------------------------
    def transition(self, event_id: str, target: EventState) -> StructuredEvent:
        event = self.get(event_id)
        assert_transition(event.status, target)
        event.status = target
        self._bump(event)
        return event

    def _bump(self, event: StructuredEvent) -> None:
        event.revision += 1
        event.updated_at = datetime.now(timezone.utc).isoformat()
        self.store.save(event)
