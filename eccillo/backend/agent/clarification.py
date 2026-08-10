"""Deterministic clarification strategy (spec §Clarification Strategy).

The LLM does not freely decide what to ask.  The backend computes the missing
fields, prioritizes them, and hands the top one to the LLM only to *phrase* the
question.  This keeps conversations deterministic and testable.
"""

from __future__ import annotations

from dataclasses import dataclass

from .state import StructuredEvent

# Priority order: which missing field we ask about first.
_PRIORITY = ["event_type", "guest_count", "date", "budget", "title", "venue"]


@dataclass
class Clarification:
    field: str
    missing: list[str]

    @property
    def has_question(self) -> bool:
        return self.field != ""


def next_clarification(event: StructuredEvent) -> Clarification:
    """Return the single highest-priority missing field, or an empty result."""
    missing = event.missing_core_fields()
    if not missing:
        return Clarification(field="", missing=[])
    for candidate in _PRIORITY:
        if candidate in missing:
            return Clarification(field=candidate, missing=missing)
    return Clarification(field=missing[0], missing=missing)
