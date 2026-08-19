"""LogisticsSkill — weather-aware logistics, transport, and accommodation notes."""

from __future__ import annotations

from typing import Any

from ..state import EventState
from .base import Skill, SkillContext


class LogisticsSkill(Skill):
    name = "logistics"
    description = "Assess weather, transport, and accommodation logistics; raise advisories as risks."
    produces = ["risks", "notes"]
    required_event_fields = ["date"]
    reads = ["date", "location", "venue", "guest_count"]
    allowed_states = {EventState.PLANNING, EventState.REVIEW}

    async def execute(self, ctx: SkillContext, payload: Any) -> tuple[dict[str, Any], list[str]]:
        event = ctx.event()
        forecast = await ctx.backend.weather.forecast(location=event.location or event.venue, date=event.date)

        notes = [f"Weather outlook for {forecast['date']}: {forecast['outlook']}, high {forecast['temp_c_high']}°C, {forecast['precip_chance']}% precip."]
        risks: list[dict[str, Any]] = []
        if forecast.get("advisory"):
            notes.append(forecast["advisory"])
            risks.append({
                "title": "Adverse weather risk",
                "description": forecast["advisory"],
                "likelihood": "high" if forecast["precip_chance"] >= 60 else "medium",
                "impact": "medium",
                "mitigation": "Arrange a covered/indoor backup and notify vendors.",
                "source": "ai",
                "status": "open",
            })

        # Accommodation hint for larger events.
        if (event.guest_count or 0) >= 200:
            notes.append("Large headcount — block a nearby hotel room allotment and arrange shuttle transport.")

        e = ctx.state.get(ctx.event_id)
        e.notes = list(dict.fromkeys([*e.notes, *notes]))
        if risks:
            e.risks = [*e.risks, *risks]
        ctx.state._bump(e)

        explanation = ["Pulled the forecast and translated it into concrete logistics notes."]
        if risks:
            explanation.append(f"Raised {len(risks)} weather-related risk(s) with mitigations.")
        return {"forecast": forecast, "notes": notes, "risks": risks}, explanation
