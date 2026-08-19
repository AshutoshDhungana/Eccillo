"""BudgetSkill — allocate the target budget across categories using benchmarks."""

from __future__ import annotations

from typing import Any

from ..state import BudgetLine, EventState
from .base import Skill, SkillContext


class BudgetSkill(Skill):
    name = "budget"
    description = "Allocate the total budget into per-category line items using event-type benchmarks."
    produces = ["budget_lines"]
    required_event_fields = ["event_type", "budget"]
    reads = ["event_type", "budget", "guest_count", "currency"]
    allowed_states = {EventState.PLANNING, EventState.REVIEW}

    async def execute(self, ctx: SkillContext, payload: Any) -> tuple[dict[str, Any], list[str]]:
        event = ctx.event()
        total = int(event.budget or 0)
        benchmarks = await ctx.backend.budgets.benchmarks(event_type=event.event_type or "other", guest_count=event.guest_count)

        lines: list[BudgetLine] = []
        allocated = 0
        for category, fraction in benchmarks.items():
            planned = int(round(total * fraction))
            allocated += planned
            lines.append(BudgetLine(category=category, label=category.title(), planned_minor=planned, currency=event.currency))
        # Reconcile rounding drift into the last line so the plan sums exactly.
        if lines and allocated != total:
            lines[-1].planned_minor += total - allocated

        ctx.state.replace(ctx.event_id, "budget_lines", lines)

        def _major(minor: int) -> str:
            return f"{event.currency} {minor / 100:,.0f}"

        explanation = [f"Allocated {_major(total)} across {len(lines)} categories using {event.event_type} benchmarks."]
        explanation += [f"{ln.category.title()}: {_major(ln.planned_minor)} ({benchmarks.get(ln.category, 0) * 100:.0f}%)" for ln in lines[:4]]
        return {"budget_lines": [ln.model_dump() for ln in lines], "total_minor": total, "currency": event.currency}, explanation
