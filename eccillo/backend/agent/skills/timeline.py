"""TimelineSkill — generate a milestone timeline anchored to the event date."""

from __future__ import annotations

from datetime import date, timedelta
from typing import Any

from ..errors import ValidationError
from ..state import EventState, TimelineItem
from .base import Skill, SkillContext


class TimelineSkill(Skill):
    name = "timeline"
    description = "Generate an ordered milestone timeline with due dates and critical-path flags."
    produces = ["timeline"]
    required_event_fields = ["event_type", "date"]
    allowed_states = {EventState.PLANNING, EventState.REVIEW}

    async def execute(self, ctx: SkillContext, payload: Any) -> tuple[dict[str, Any], list[str]]:
        event = ctx.event()
        try:
            anchor = date.fromisoformat(str(event.date))
        except ValueError as exc:
            raise ValidationError("Event date must be an ISO date (YYYY-MM-DD).") from exc

        template = await ctx.backend.timelines.template(event_type=event.event_type or "other")
        items: list[TimelineItem] = []
        for row in template:
            due = anchor + timedelta(days=int(row.get("offset_days", 0)))
            items.append(
                TimelineItem(
                    title=row["title"],
                    offset_days=int(row.get("offset_days", 0)),
                    due_at=due.isoformat(),
                    critical_path=bool(row.get("critical_path", False)),
                )
            )
        ctx.state.replace(ctx.event_id, "timeline", items)

        critical = [i.title for i in items if i.critical_path]
        explanation = [
            f"Built a {len(items)}-milestone timeline anchored to {anchor.isoformat()}.",
            f"Critical-path milestones: {', '.join(critical)}." if critical else "No critical-path milestones flagged.",
        ]
        return {"timeline": [i.model_dump() for i in items], "milestone_count": len(items)}, explanation
