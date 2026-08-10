"""Workflow engine & execution queue (spec §Execution Queue + §Error Recovery).

The orchestrator never fires tool calls ad hoc.  It compiles an
:class:`ExecutionPlan` — a small DAG of skill invocations — and hands it to the
engine, which:

* runs independent steps **concurrently** (bounded by ``max_concurrency``),
* respects declared dependencies,
* checks each step against the :class:`PolicyEngine` (deny / require-approval),
* retries transient (``RETRYABLE_ERROR``) failures,
* blocks steps whose dependencies failed instead of cascading errors,
* records everything on the :class:`Observer`.

It returns a map of ``step_id -> SkillResult`` and never raises.
"""

from __future__ import annotations

import asyncio
from collections.abc import Awaitable, Callable
from dataclasses import dataclass, field
from typing import Any

from ..config import AgentConfig
from ..errors import Outcome
from ..observability import Observer
from ..policy import Decision, PolicyEngine
from ..registry import CapabilityRegistry
from ..skills.base import SkillContext, SkillResult
from ..state import EventStateManager


@dataclass
class PlanStep:
    id: str
    skill: str
    depends_on: list[str] = field(default_factory=list)
    inputs: dict[str, Any] = field(default_factory=dict)
    reason: str = ""


@dataclass
class ExecutionPlan:
    goal: str
    steps: list[PlanStep] = field(default_factory=list)

    def step_ids(self) -> set[str]:
        return {s.id for s in self.steps}


ContextFactory = Callable[[str, dict[str, Any]], SkillContext]


class WorkflowEngine:
    def __init__(
        self,
        *,
        registry: CapabilityRegistry,
        policy: PolicyEngine,
        state_manager: EventStateManager,
        event_id: str,
        observer: Observer,
        make_context: ContextFactory,
        config: AgentConfig,
    ):
        self.registry = registry
        self.policy = policy
        self.state = state_manager
        self.event_id = event_id
        self.observer = observer
        self.make_context = make_context
        self.config = config
        self._sem = asyncio.Semaphore(max(1, config.max_concurrency))
        # Steps that reached an approval gate this run (surfaced to the user).
        self.pending_approvals: list[dict[str, Any]] = []
        # Skills for which human approval has already been granted this run.
        self.approved: set[str] = set()

    async def execute(self, plan: ExecutionPlan) -> dict[str, SkillResult]:
        results: dict[str, SkillResult] = {}
        done: set[str] = set()
        with self.observer.span(plan.goal, kind="workflow", steps=len(plan.steps)):
            while len(done) < len(plan.steps):
                ready = [
                    s for s in plan.steps
                    if s.id not in done and all(dep in done for dep in s.depends_on)
                ]
                if not ready:
                    # Remaining steps have unresolved/cyclic deps — mark blocked.
                    for s in plan.steps:
                        if s.id not in done:
                            results[s.id] = SkillResult(s.skill, Outcome.FAILURE, error="unresolved dependency / cycle")
                            done.add(s.id)
                    break

                wave = await asyncio.gather(*(self._run_or_block(step, results) for step in ready))
                for step_id, result in wave:
                    results[step_id] = result
                    done.add(step_id)
        return results

    async def _run_or_block(self, step: PlanStep, results: dict[str, SkillResult]) -> tuple[str, SkillResult]:
        failed = [d for d in step.depends_on if not results.get(d, SkillResult(step.skill, Outcome.FAILURE)).ok]
        if failed:
            return step.id, SkillResult(step.skill, Outcome.FAILURE, error=f"blocked by upstream failure: {', '.join(failed)}")

        if not self.registry.has(step.skill):
            return step.id, SkillResult(step.skill, Outcome.FAILURE, error=f"unknown skill '{step.skill}'")
        skill = self.registry.get(step.skill)

        # Policy: deny or require approval BEFORE running (spec §Human Approval).
        state = self.state.get(self.event_id).status
        decision = self.policy.evaluate(skill, state)
        if decision.decision == Decision.DENY:
            self.observer.incr("policy_denied")
            return step.id, SkillResult(step.skill, Outcome.PERMISSION_ERROR, error=decision.reason)
        if decision.decision == Decision.REQUIRE_APPROVAL and step.skill not in self.approved:
            self.observer.incr("approval_required")
            self.pending_approvals.append({"skill": step.skill, "inputs": step.inputs, "reason": decision.reason})
            return step.id, SkillResult(step.skill, Outcome.NEEDS_APPROVAL, error=decision.reason, data={"pending": step.inputs})

        return step.id, await self._run_with_retries(skill, step)

    async def _run_with_retries(self, skill: Any, step: PlanStep) -> SkillResult:
        attempts = 0
        max_attempts = 1 + max(0, self.config.max_skill_retries)
        result = SkillResult(step.skill, Outcome.FAILURE, error="not run")
        while attempts < max_attempts:
            attempts += 1
            async with self._sem:
                with self.observer.span(step.skill, kind="skill", attempt=attempts, step=step.id) as span:
                    ctx = self.make_context(step.skill, step.inputs)
                    result = await skill.run(ctx, step.inputs)
                    span.set(outcome=result.outcome.value)
            if result.outcome != Outcome.RETRYABLE_ERROR:
                break
            self.observer.incr("skill_retry")
        return result
