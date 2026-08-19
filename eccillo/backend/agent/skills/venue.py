"""VenueRecommendationSkill — shortlist venues via the backend venue service."""

from __future__ import annotations

from typing import Any

from ..state import EventState, VendorRef
from .base import Skill, SkillContext


class VenueRecommendationSkill(Skill):
    name = "venue"
    description = "Recommend and rank venues that fit capacity, budget, and location, with reasons."
    produces = ["vendors"]  # venues are stored as vendor refs with category='venue'
    required_event_fields = ["event_type", "guest_count"]
    # 'vendors' is deliberately absent: this skill only rewrites its own
    # category slice, so reading it back would self-invalidate every turn.
    reads = ["event_type", "guest_count", "budget", "location", "venue", "date"]
    allowed_states = {EventState.PLANNING, EventState.REVIEW}

    async def execute(self, ctx: SkillContext, payload: Any) -> tuple[dict[str, Any], list[str]]:
        event = ctx.event()
        results = await ctx.backend.venues.search(
            event_type=event.event_type or "other",
            guest_count=event.guest_count,
            budget_minor=event.budget,
            location=event.location or event.venue,
            date=event.date,
        )
        top = results[:3]
        refs = [
            VendorRef(vendor_id=v["id"], name=v["name"], category="venue", score=v["score"], reasons=v["reasons"], status="shortlisted")
            for v in top
        ]
        # Merge into vendors without clobbering already-shortlisted non-venue vendors.
        existing = [v for v in event.vendors if v.category != "venue"]
        ctx.state.replace(ctx.event_id, "vendors", existing + refs)

        explanation = [f"Evaluated {len(results)} venues; shortlisted the top {len(top)}."]
        if top:
            best = top[0]
            explanation.append(f"Top pick '{best['name']}' — {'; '.join(best['reasons'])}.")
        return {"venues": [r.model_dump() for r in refs]}, explanation
