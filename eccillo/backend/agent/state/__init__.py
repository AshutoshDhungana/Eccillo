"""Event state machine and structured-event management."""

from .event_state import (
    REQUIRED_CORE_FIELDS,
    BudgetLine,
    EventStateManager,
    EventStateStore,
    GuestSegment,
    StructuredEvent,
    TaskItem,
    TimelineItem,
    VendorRef,
)
from .machine import BACKEND_STATUS_MAP, EventState, allowed_next, assert_transition, can_transition

__all__ = [
    "EventState",
    "EventStateManager",
    "EventStateStore",
    "StructuredEvent",
    "TimelineItem",
    "BudgetLine",
    "VendorRef",
    "TaskItem",
    "GuestSegment",
    "REQUIRED_CORE_FIELDS",
    "BACKEND_STATUS_MAP",
    "assert_transition",
    "can_transition",
    "allowed_next",
]
