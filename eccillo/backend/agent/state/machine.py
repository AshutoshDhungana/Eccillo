"""The event state machine (spec §AI State Machine).

Every event is always in exactly one state.  The current state gates which
skills, actions, and tool calls are available, and contributes to the composed
prompt.  Transitions are explicit and guarded so the orchestrator can never
skip, e.g., approval before booking.

Note this is the *AI workflow* state, which is richer than the backend
``Event.status`` column (draft/planning/published/live/completed/archived).
:data:`BACKEND_STATUS_MAP` records the intended projection for when the layer is
wired to the ORM in a later phase.
"""

from __future__ import annotations

import enum

from ..errors import StateTransitionError


class EventState(str, enum.Enum):
    DRAFT = "draft"
    COLLECTING_INFO = "collecting_information"
    PLANNING = "planning"
    REVIEW = "review"
    APPROVAL = "approval"
    BOOKING = "booking"
    EXECUTION = "execution"
    LIVE = "live"
    COMPLETED = "completed"
    ARCHIVED = "archived"


# Allowed forward/backward transitions.  Backward edges exist because planning
# is iterative — a review can send us back to collect more info or re-plan.
_TRANSITIONS: dict[EventState, set[EventState]] = {
    EventState.DRAFT: {EventState.COLLECTING_INFO, EventState.ARCHIVED},
    EventState.COLLECTING_INFO: {EventState.PLANNING, EventState.DRAFT, EventState.ARCHIVED},
    EventState.PLANNING: {EventState.REVIEW, EventState.COLLECTING_INFO, EventState.ARCHIVED},
    EventState.REVIEW: {EventState.APPROVAL, EventState.PLANNING, EventState.COLLECTING_INFO},
    EventState.APPROVAL: {EventState.BOOKING, EventState.REVIEW, EventState.PLANNING},
    EventState.BOOKING: {EventState.EXECUTION, EventState.REVIEW},
    EventState.EXECUTION: {EventState.LIVE, EventState.BOOKING},
    EventState.LIVE: {EventState.COMPLETED},
    EventState.COMPLETED: {EventState.ARCHIVED},
    EventState.ARCHIVED: set(),
}

# Intended projection onto the existing backend Event.status field.
BACKEND_STATUS_MAP: dict[EventState, str] = {
    EventState.DRAFT: "draft",
    EventState.COLLECTING_INFO: "draft",
    EventState.PLANNING: "planning",
    EventState.REVIEW: "planning",
    EventState.APPROVAL: "planning",
    EventState.BOOKING: "published",
    EventState.EXECUTION: "published",
    EventState.LIVE: "live",
    EventState.COMPLETED: "completed",
    EventState.ARCHIVED: "archived",
}


def can_transition(current: EventState, target: EventState) -> bool:
    return target in _TRANSITIONS.get(current, set())


def assert_transition(current: EventState, target: EventState) -> None:
    if current == target:
        return
    if not can_transition(current, target):
        raise StateTransitionError(
            f"Illegal transition {current.value} -> {target.value}",
            details={"allowed": sorted(s.value for s in _TRANSITIONS.get(current, set()))},
        )


def allowed_next(current: EventState) -> set[EventState]:
    return set(_TRANSITIONS.get(current, set()))
