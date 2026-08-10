"""PlanningSkill — derive the domain requirements checklist for the event.

This is distinct from the orchestrator's *planner* (which sequences skills).
Here we produce the domain-level requirements an event of this type needs, which
downstream skills (timeline, budget, vendor) consume.
"""

from __future__ import annotations

from typing import Any

from ..state import EventState
from .base import Skill, SkillContext

_REQUIREMENTS = {
    "conference": ["venue", "catering", "av", "speakers", "registration", "signage", "wifi", "badges"],
    "wedding": ["venue", "catering", "decoration", "photography", "invitations", "music", "seating"],
    "hackathon": ["venue", "catering", "wifi", "power", "judges", "prizes", "swag", "registration"],
    "festival": ["venue", "stage", "security", "vendors", "ticketing", "sanitation", "permits"],
    "workshop": ["venue", "materials", "catering", "av", "registration"],
    "_default": ["venue", "catering", "invitations", "logistics"],
}


class PlanningSkill(Skill):
    name = "planning"
    description = "Produce the domain requirements checklist appropriate to the event type."
    produces = ["requirements"]
    required_event_fields = ["event_type"]
    allowed_states = {EventState.PLANNING, EventState.COLLECTING_INFO, EventState.REVIEW}

    async def execute(self, ctx: SkillContext, payload: Any) -> tuple[dict[str, Any], list[str]]:
        event = ctx.event()
        et = event.event_type or "other"
        requirements = _REQUIREMENTS.get(et, _REQUIREMENTS["_default"])

        # Organization memory can pin extra standing requirements (e.g. "livestream").
        org_reqs = ctx.memory.org_memory(ctx.organization_id).get("standing_requirements", [])
        merged = list(dict.fromkeys([*requirements, *org_reqs]))

        ctx.state.apply_fields(ctx.event_id, {"requirements": merged})

        explanation = [f"A {et} typically needs: {', '.join(requirements)}."]
        if org_reqs:
            explanation.append(f"Added organization standing requirements: {', '.join(org_reqs)}.")
        return {"requirements": merged, "count": len(merged)}, explanation
