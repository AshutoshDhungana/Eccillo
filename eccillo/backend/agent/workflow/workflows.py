"""Backend-owned workflow definitions (spec §3 & architecture diagram).

Workflows are declarative DAGs of skill steps.  The AI does **not** invent the
execution order — it picks a named workflow and the backend owns its shape.
Independent steps (no dependency edge) are run concurrently by the engine.
"""

from __future__ import annotations

from collections.abc import Callable

from ..state import EventState, StructuredEvent
from .engine import ExecutionPlan, PlanStep


def timeline_workflow() -> ExecutionPlan:
    return ExecutionPlan(
        goal="Timeline",
        steps=[PlanStep(id="timeline", skill="timeline", reason="Generate milestone timeline")],
    )


def budget_workflow() -> ExecutionPlan:
    return ExecutionPlan(
        goal="Budget",
        steps=[PlanStep(id="budget", skill="budget", reason="Allocate budget by category")],
    )


def vendor_workflow() -> ExecutionPlan:
    return ExecutionPlan(
        goal="Vendor sourcing",
        steps=[
            PlanStep(id="planning", skill="planning", reason="Determine required categories"),
            PlanStep(id="budget", skill="budget", reason="Category budgets constrain vendor picks"),
            PlanStep(id="venue", skill="venue", depends_on=["planning"], reason="Shortlist venues"),
            PlanStep(id="vendor", skill="vendor", depends_on=["planning", "budget"], reason="Match vendors per category"),
        ],
    )


def guest_workflow() -> ExecutionPlan:
    return ExecutionPlan(
        goal="Guest management",
        steps=[PlanStep(id="guest", skill="guest", reason="Segment guests and reconcile headcount")],
    )


def logistics_workflow() -> ExecutionPlan:
    return ExecutionPlan(
        goal="Logistics",
        steps=[
            PlanStep(id="logistics", skill="logistics", reason="Weather + transport + accommodation"),
            PlanStep(id="calendar", skill="calendar", reason="Check organizer calendar conflicts"),
        ],
    )


def full_plan_workflow() -> ExecutionPlan:
    """The end-to-end planning workflow that fans out across all domains."""
    return ExecutionPlan(
        goal="Full event plan",
        steps=[
            # Wave 1 — everything whose inputs are already satisfied runs concurrently.
            PlanStep(id="planning", skill="planning", reason="Derive domain requirements"),
            PlanStep(id="timeline", skill="timeline", reason="Generate milestone timeline"),
            PlanStep(id="budget", skill="budget", reason="Allocate budget by category"),
            PlanStep(id="guest", skill="guest", reason="Segment guests"),
            PlanStep(id="venue", skill="venue", depends_on=["planning"], reason="Shortlist venues"),
            PlanStep(id="logistics", skill="logistics", reason="Assess weather & logistics"),
            PlanStep(id="calendar", skill="calendar", reason="Check calendar conflicts"),
            # Wave 2 — depend on wave-1 outputs.
            PlanStep(id="tasks", skill="tasks", depends_on=["timeline"], reason="Break timeline into tasks"),
            PlanStep(id="vendor", skill="vendor", depends_on=["planning", "budget"], reason="Match vendors within budget"),
            # Wave 3 — read the whole plan and score it.
            PlanStep(
                id="analytics",
                skill="analytics",
                depends_on=["timeline", "budget", "venue", "vendor", "guest", "logistics"],
                reason="Score readiness and detect conflicts",
            ),
        ],
    )


def comms_workflow() -> ExecutionPlan:
    return ExecutionPlan(
        goal="Communications",
        steps=[
            PlanStep(id="email", skill="email", reason="Draft the invitation/update email"),
            PlanStep(id="notification", skill="notification", reason="Notify the organizing team"),
        ],
    )


WORKFLOWS: dict[str, Callable[[], ExecutionPlan]] = {
    "timeline": timeline_workflow,
    "budget": budget_workflow,
    "vendor": vendor_workflow,
    "guest": guest_workflow,
    "logistics": logistics_workflow,
    "comms": comms_workflow,
    "full_plan": full_plan_workflow,
}


def select_workflow(event: StructuredEvent, *, intent: str) -> ExecutionPlan | None:
    """Deterministically choose a workflow from state + intent.

    Returns ``None`` when no execution should happen (e.g. still gathering info,
    or the user only asked for a summary).
    """
    if intent == "summary":
        return None
    if intent == "email":
        return comms_workflow()
    if event.status in (EventState.PLANNING, EventState.REVIEW):
        return full_plan_workflow()
    return None
