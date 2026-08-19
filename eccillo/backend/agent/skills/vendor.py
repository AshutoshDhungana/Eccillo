"""VendorRecommendationSkill — match vendors per required category, with scoring."""

from __future__ import annotations

from typing import Any

from ..state import EventState, VendorRef
from .base import Skill, SkillContext

# Requirement keywords that map to marketplace vendor categories.
_CATEGORY_REQUIREMENTS = {"catering", "av", "decoration", "photography"}


class VendorRecommendationSkill(Skill):
    name = "vendor"
    description = "For each required category, recommend the best-matching vendor with an explainable score."
    produces = ["vendors"]
    required_event_fields = ["event_type", "budget"]
    reads = ["event_type", "budget", "requirements", "budget_lines", "date"]
    allowed_states = {EventState.PLANNING, EventState.REVIEW}

    async def execute(self, ctx: SkillContext, payload: Any) -> tuple[dict[str, Any], list[str]]:
        event = ctx.event()
        categories = [r for r in (event.requirements or []) if r in _CATEGORY_REQUIREMENTS]
        if not categories:
            categories = ["catering", "av"]

        # Prefer organization's preferred vendors when present (org memory).
        preferred = set(ctx.memory.org_memory(ctx.organization_id).get("preferred_vendors", []))

        refs: list[VendorRef] = []
        explanation: list[str] = []
        for category in categories:
            budget_line = next((b for b in event.budget_lines if b.category == category), None)
            constraints = {"budget_max_minor": budget_line.planned_minor if budget_line else None, "date": event.date}
            matches = await ctx.backend.vendors.search(category=category, constraints=constraints)
            if not matches:
                continue
            best = matches[0]
            reasons = list(best["reasons"])
            if best["name"] in preferred:
                reasons.insert(0, "preferred vendor for this organization")
            refs.append(VendorRef(vendor_id=best["id"], name=best["name"], category=category, score=best["score"], reasons=reasons, status="shortlisted"))
            explanation.append(f"{category.title()}: '{best['name']}' (score {best['score']}) — {reasons[0]}.")

        existing = [v for v in event.vendors if v.category not in categories]
        ctx.state.replace(ctx.event_id, "vendors", existing + refs)
        return {"vendors": [r.model_dump() for r in refs], "categories": categories}, explanation
