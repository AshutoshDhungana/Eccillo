"""TaskSkill — break the timeline down into an actionable task checklist."""

from __future__ import annotations

from typing import Any

from ..state import EventState, TaskItem
from .base import Skill, SkillContext


class TaskSkill(Skill):
    name = "tasks"
    description = "Derive a dependency-aware task checklist from the milestone timeline."
    produces = ["tasks"]
    # Depends on the timeline having been produced first.
    required_event_fields = ["timeline"]
    allowed_states = {EventState.PLANNING, EventState.REVIEW}

    async def execute(self, ctx: SkillContext, payload: Any) -> tuple[dict[str, Any], list[str]]:
        event = ctx.event()
        tasks: list[TaskItem] = []
        previous: str | None = None
        for milestone in event.timeline:
            title = f"Complete: {milestone.title}"
            tasks.append(TaskItem(title=title, due_at=milestone.due_at, depends_on=previous))
            # Chain critical-path milestones so downstream work can't start early.
            previous = title if milestone.critical_path else previous

        ctx.state.replace(ctx.event_id, "tasks", tasks)
        explanation = [
            f"Generated {len(tasks)} tasks from {len(event.timeline)} milestones.",
            "Critical-path milestones are chained via task dependencies so blocked work surfaces early.",
        ]
        return {"tasks": [t.model_dump() for t in tasks], "task_count": len(tasks)}, explanation
