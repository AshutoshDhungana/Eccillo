"""Hybrid EventStateStore (Phase 3, Milestone 2).

Implements the frozen ``agent.state.EventStateStore`` interface against the real
planning tables plus the ``AgentEventState`` sidecar:

* **Canonical** StructuredEvent fields ↔ ``planning.Event`` + ``Milestone`` /
  ``Task`` / ``BudgetLineItem`` / ``Risk`` (only rows with ``source="ai"`` are
  managed by the agent; ``user``/``template`` rows are preserved).
* **Agent-only** fields (requirements, vendors, guests, notes, timeline meta,
  fine-grained AI status) ↔ ``orchestration.AgentEventState``.

A per-store in-memory cache keyed by ``event_id`` collapses the many
``get()`` calls one turn makes into a single DB read; ``save()`` is
write-through and refreshes the cache with the same instance the agent mutates.
"""

from __future__ import annotations

import uuid
from datetime import date, datetime, time, timezone as dttz
from typing import Any

from django.db import transaction

from accounts.models import Organization
from agent.state import BACKEND_STATUS_MAP, EventState, StructuredEvent
from planning.models import BUDGET_CATEGORIES, EVENT_TYPES, BudgetLineItem, Event, Milestone, Risk, Task

_VALID_EVENT_TYPES = {v for v, _ in EVENT_TYPES}
_VALID_BUDGET_CATEGORIES = {v for v, _ in BUDGET_CATEGORIES}
_VALID_RISK_LEVELS = {"low", "medium", "high"}
_VALID_RISK_STATUS = {"open", "mitigated", "accepted", "closed"}
_VALID_TASK_STATUS = {"todo", "in_progress", "blocked", "done"}

# Reverse of BACKEND_STATUS_MAP: pick the first EventState projecting to a status.
_REVERSE_STATUS: dict[str, EventState] = {}
for _state, _status in BACKEND_STATUS_MAP.items():
    _REVERSE_STATUS.setdefault(_status, _state)


def _to_dt(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        if "T" in value:
            dt = datetime.fromisoformat(value)
            return dt if dt.tzinfo else dt.replace(tzinfo=dttz.utc)
        return datetime.combine(date.fromisoformat(value), time.min, tzinfo=dttz.utc)
    except ValueError:
        return None


def _to_date_str(value: datetime | None) -> str | None:
    return value.date().isoformat() if value else None


class DjangoEventStateStore:
    """See module docstring. Satisfies ``agent.state.EventStateStore``."""

    def __init__(self) -> None:
        self._cache: dict[str, StructuredEvent] = {}
        # The most recently read/written event — lets location-unaware ports
        # (VendorService.search has no location arg) read the current event's
        # location for discovery. One turn operates on a single event.
        self.last_event_id: str | None = None

    # -- reads ---------------------------------------------------------------
    def get(self, event_id: str) -> StructuredEvent | None:
        self.last_event_id = event_id
        if event_id in self._cache:
            return self._cache[event_id]
        try:
            event = Event.objects.get(pk=uuid.UUID(event_id))
        except (Event.DoesNotExist, ValueError):
            return None
        se = self._to_structured(event)
        self._cache[event_id] = se
        return se

    def all(self) -> list[StructuredEvent]:
        return [self.get(e.id.hex) for e in Event.objects.all()]

    # -- writes --------------------------------------------------------------
    def save(self, se: StructuredEvent) -> StructuredEvent:
        with transaction.atomic():
            event = self._upsert_event(se)
            self._sync_children(event, se)
            self._upsert_sidecar(event, se)
        self._cache[se.event_id] = se
        self.last_event_id = se.event_id
        return se

    def current_location(self) -> str | None:
        """Location of the event currently being planned (for discovery)."""
        if not self.last_event_id:
            return None
        se = self._cache.get(self.last_event_id) or self.get(self.last_event_id)
        return (se.location or se.venue) if se else None

    # -- mapping: ORM -> StructuredEvent ------------------------------------
    def _to_structured(self, event: Event) -> StructuredEvent:
        sidecar = getattr(event, "agent_state", None)
        meta = (sidecar.timeline_meta if sidecar else {}) or {}
        location = event.location or {}

        timeline = [
            {
                "title": m.title,
                "due_at": _to_date_str(m.due_at),
                "critical_path": m.is_critical_path,
                "offset_days": (meta.get(m.title) or {}).get("offset_days", 0),
                "source": m.source,
            }
            for m in event.milestones.all()
        ]
        tasks = [
            {"title": t.title, "status": t.status, "due_at": _to_date_str(t.due_at), "source": t.source}
            for t in event.tasks.all()
        ]
        budget_lines = [
            {"category": b.category, "label": b.label, "planned_minor": b.planned_minor, "currency": b.currency, "source": b.source}
            for b in event.budget_items.all()
        ]
        risks = [
            {"title": r.title, "description": r.description, "likelihood": r.likelihood, "impact": r.impact,
             "mitigation": r.mitigation, "status": r.status, "source": r.source}
            for r in event.risks.all()
        ]

        status = EventState(sidecar.ai_status) if (sidecar and sidecar.ai_status) else _REVERSE_STATUS.get(event.status, EventState.DRAFT)

        return StructuredEvent(
            event_id=event.id.hex,
            organization_id=str(event.organization_id) if event.organization_id else None,
            organizer_id=str(sidecar.organizer_id) if (sidecar and sidecar.organizer_id) else None,
            event_type=event.type,
            title=event.title or None,
            description=event.description or "",
            budget=event.budget_target_minor or None,
            currency=event.currency,
            date=_to_date_str(event.starts_at),
            end_date=_to_date_str(event.ends_at),
            timezone=event.timezone,
            guest_count=event.expected_attendees or None,
            venue=location.get("venue"),
            location=location.get("location"),
            requirements=(sidecar.requirements if sidecar else []) or [],
            timeline=timeline,
            budget_lines=budget_lines,
            vendors=(sidecar.vendors if sidecar else []) or [],
            tasks=tasks,
            guests=(sidecar.guests if sidecar else []) or [],
            risks=risks,
            notes=(sidecar.notes if sidecar else []) or [],
            status=status,
            revision=event.revision,
        )

    # -- mapping: StructuredEvent -> ORM ------------------------------------
    def _upsert_event(self, se: StructuredEvent) -> Event:
        pk = uuid.UUID(se.event_id)
        event_type = se.event_type if se.event_type in _VALID_EVENT_TYPES else "other"
        fields: dict[str, Any] = {
            "title": se.title or "Untitled event",
            "type": event_type,
            "status": BACKEND_STATUS_MAP.get(se.status, "draft"),
            "starts_at": _to_dt(se.date),
            "ends_at": _to_dt(se.end_date),
            "timezone": se.timezone,
            "expected_attendees": se.guest_count or 0,
            "budget_target_minor": se.budget or 0,
            "currency": se.currency,
            "description": se.description or "",
            "location": {"venue": se.venue, "location": se.location},
            "source": "ai",
        }
        existing = Event.objects.filter(pk=pk).first()
        if existing is None:
            if not se.organization_id:
                raise ValueError("Cannot create an event without organization_id.")
            return Event.objects.create(id=pk, organization=Organization.objects.get(pk=se.organization_id), **fields)
        for key, value in fields.items():
            setattr(existing, key, value)
        existing.save()
        return existing

    def _sync_children(self, event: Event, se: StructuredEvent) -> None:
        # Replace only AI-managed rows; user/template rows are preserved.
        event.milestones.filter(source="ai").delete()
        Milestone.objects.bulk_create([
            Milestone(event=event, title=i.title, due_at=_to_dt(i.due_at), is_critical_path=bool(i.critical_path), source="ai", order=idx)
            for idx, i in enumerate(se.timeline)
        ])

        event.tasks.filter(source="ai").delete()
        Task.objects.bulk_create([
            Task(event=event, title=t.title, status=t.status if t.status in _VALID_TASK_STATUS else "todo", due_at=_to_dt(t.due_at), source="ai")
            for t in se.tasks
        ])

        event.budget_items.filter(source="ai").delete()
        BudgetLineItem.objects.bulk_create([
            BudgetLineItem(
                event=event,
                category=b.category if b.category in _VALID_BUDGET_CATEGORIES else "misc",
                label=b.label or "",
                planned_minor=b.planned_minor,
                currency=b.currency,
                source="ai",
            )
            for b in se.budget_lines
        ])

        event.risks.filter(source="ai").delete()
        Risk.objects.bulk_create([
            Risk(
                event=event,
                title=r.get("title", "Risk"),
                description=r.get("description", ""),
                likelihood=r.get("likelihood") if r.get("likelihood") in _VALID_RISK_LEVELS else "low",
                impact=r.get("impact") if r.get("impact") in _VALID_RISK_LEVELS else "low",
                mitigation=r.get("mitigation", ""),
                status=r.get("status") if r.get("status") in _VALID_RISK_STATUS else "open",
                source="ai",
            )
            for r in se.risks
        ])

    def _upsert_sidecar(self, event: Event, se: StructuredEvent) -> None:
        from orchestration.models import AgentEventState

        timeline_meta = {i.title: {"offset_days": i.offset_days, "critical_path": bool(i.critical_path)} for i in se.timeline}
        AgentEventState.objects.update_or_create(
            event=event,
            defaults={
                "ai_status": se.status.value,
                "requirements": list(se.requirements),
                "vendors": [v.model_dump() for v in se.vendors],
                "guests": [g.model_dump() for g in se.guests],
                "notes": list(se.notes),
                "timeline_meta": timeline_meta,
                "organizer_id": uuid.UUID(se.organizer_id) if se.organizer_id else None,
                "snapshot": se.snapshot(),
            },
        )
