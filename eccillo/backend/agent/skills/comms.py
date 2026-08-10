"""Outbound/communication skills: email, notifications, calendar.

The EmailSkill only ever *drafts*; actually sending is an irreversible action
the PolicyEngine gates behind human approval (spec §Human Approval).
"""

from __future__ import annotations

from typing import Any

from ..state import EventState
from .base import Skill, SkillContext


class EmailSkill(Skill):
    name = "email"
    description = "Draft an invitation or update email for the event (send is approval-gated)."
    produces = []
    required_event_fields = ["title"]
    requires_approval = True  # sending reaches real recipients
    allowed_states = {EventState.REVIEW, EventState.APPROVAL, EventState.BOOKING, EventState.EXECUTION}

    async def execute(self, ctx: SkillContext, payload: Any) -> tuple[dict[str, Any], list[str]]:
        event = ctx.event()
        style = ctx.memory.user_memory(ctx.user_id).get("writing_style", "warm and professional")
        subject = f"You're invited: {event.title}"
        when = f" on {event.date}" if event.date else ""
        venue = f" at {event.venue}" if event.venue else ""
        body = (
            f"Hello,\n\nWe'd love to have you at {event.title}{when}{venue}. "
            f"More details and RSVP to follow.\n\nWarm regards,\nThe Organizing Team"
        )
        draft = await ctx.backend.email.draft(to=["<guest-list>"], subject=subject, body=body)
        explanation = [f"Drafted an invitation in a {style} tone. Awaiting approval before sending."]
        return {"draft": draft, "requires_approval": True}, explanation


class NotificationSkill(Skill):
    name = "notification"
    description = "Queue an in-app/push notification to the organizing team."
    produces = []
    allowed_states = None

    async def execute(self, ctx: SkillContext, payload: Any) -> tuple[dict[str, Any], list[str]]:
        event = ctx.event()
        result = await ctx.backend.notifications.enqueue(
            channel="in_app",
            template_key="plan_updated",
            payload={"event_id": event.event_id, "title": event.title, "status": event.status.value},
        )
        return {"notification": result}, ["Queued a team notification about the latest plan update."]


class CalendarSkill(Skill):
    name = "calendar"
    description = "Check the organizer's calendar for conflicts on the event date and prepare a hold."
    produces = ["risks"]
    required_event_fields = ["date"]
    allowed_states = {EventState.PLANNING, EventState.REVIEW, EventState.BOOKING}

    async def execute(self, ctx: SkillContext, payload: Any) -> tuple[dict[str, Any], list[str]]:
        event = ctx.event()
        conflicts = await ctx.backend.calendar.check_conflicts(organizer_id=ctx.user_id, date=event.date)
        explanation = [f"Checked the calendar for {event.date}: {'no conflicts' if not conflicts else str(len(conflicts)) + ' conflict(s)'}."]
        if conflicts:
            e = ctx.state.get(ctx.event_id)
            e.risks.append({"title": "Calendar conflict", "description": f"{len(conflicts)} existing commitment(s) on {event.date}.", "likelihood": "high", "impact": "medium", "source": "ai", "status": "open"})
            ctx.state._bump(e)
        return {"conflicts": conflicts, "hold_ready": not conflicts}, explanation
