"""AnalyticsSkill — readiness scoring, conflict detection, and risk identification.

Read-only: it never mutates plan data except to append identified risks.  It is
what powers planning summaries and executive briefs.
"""

from __future__ import annotations

from datetime import date
from typing import Any

from ..state import EventState
from .base import Skill, SkillContext


class AnalyticsSkill(Skill):
    name = "analytics"
    description = "Score plan readiness, detect scheduling/budget conflicts, and surface risks."
    produces = ["risks"]
    required_event_fields = ["event_type"]
    allowed_states = None  # available in any state for status/summary

    async def execute(self, ctx: SkillContext, payload: Any) -> tuple[dict[str, Any], list[str]]:
        event = ctx.event()

        checks = {
            "has_date": bool(event.date),
            "has_budget": bool(event.budget),
            "has_timeline": bool(event.timeline),
            "budget_allocated": bool(event.budget_lines),
            "venue_shortlisted": any(v.category == "venue" for v in event.vendors),
            "vendors_shortlisted": any(v.category != "venue" for v in event.vendors),
            "guests_segmented": bool(event.guests),
            "tasks_generated": bool(event.tasks),
        }
        readiness = round(100 * sum(checks.values()) / len(checks))

        conflicts: list[str] = []
        # Budget conflict: allocations exceed target.
        allocated = sum(b.planned_minor for b in event.budget_lines)
        if event.budget and allocated > event.budget:
            conflicts.append(f"Budget over-allocated by {(allocated - event.budget) / 100:,.0f} {event.currency}.")
        # Schedule conflict: any critical milestone already in the past.
        today = date.today()
        for m in event.timeline:
            if m.critical_path and m.due_at and date.fromisoformat(m.due_at) < today:
                conflicts.append(f"Critical milestone '{m.title}' is already overdue ({m.due_at}).")
        # Capacity conflict: shortlisted venue too small.
        venue = next((v for v in event.vendors if v.category == "venue"), None)
        if venue and event.guest_count and venue.score < 0.5:
            conflicts.append(f"Top venue '{venue.name}' scores low against current requirements.")

        new_risks = [{"title": "Planning conflict", "description": c, "likelihood": "medium", "impact": "high", "source": "ai", "status": "open"} for c in conflicts]
        if new_risks:
            e = ctx.state.get(ctx.event_id)
            e.risks = [*e.risks, *new_risks]
            ctx.state._bump(e)

        explanation = [f"Plan readiness: {readiness}% ({sum(checks.values())}/{len(checks)} checks passing)."]
        if conflicts:
            explanation.append(f"Detected {len(conflicts)} conflict(s): " + "; ".join(conflicts))
        else:
            explanation.append("No blocking conflicts detected.")

        return {"readiness": readiness, "checks": checks, "conflicts": conflicts, "open_risks": len(event.risks)}, explanation
