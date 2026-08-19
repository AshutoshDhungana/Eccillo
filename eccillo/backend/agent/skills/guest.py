"""GuestSkill — build guest segments and reconcile expected headcount."""

from __future__ import annotations

from typing import Any

from ..state import EventState, GuestSegment
from .base import Skill, SkillContext


class GuestSkill(Skill):
    name = "guest"
    description = "Segment the guest list and reconcile headcount against capacity/budget."
    produces = ["guests"]
    required_event_fields = ["guest_count"]
    reads = ["guest_count", "event_type"]
    allowed_states = {EventState.PLANNING, EventState.REVIEW}

    async def execute(self, ctx: SkillContext, payload: Any) -> tuple[dict[str, Any], list[str]]:
        event = ctx.event()
        total = int(event.guest_count or 0)

        # Simple, deterministic default segmentation by event type.
        if event.event_type == "conference":
            split = {"Attendees": 0.8, "Speakers": 0.08, "Sponsors": 0.07, "Staff": 0.05}
        elif event.event_type == "wedding":
            split = {"Family": 0.4, "Friends": 0.4, "Colleagues": 0.15, "Vendors": 0.05}
        else:
            split = {"Guests": 0.9, "Staff": 0.1}

        segments = [GuestSegment(label=label, count=int(round(total * frac))) for label, frac in split.items()]
        # Reconcile rounding into the largest segment.
        drift = total - sum(s.count for s in segments)
        if segments and drift:
            segments[0].count += drift

        ctx.state.replace(ctx.event_id, "guests", segments)
        explanation = [f"Segmented {total} guests into {len(segments)} groups: " + ", ".join(f"{s.label} {s.count}" for s in segments)]
        return {"guests": [s.model_dump() for s in segments], "total": total}, explanation
