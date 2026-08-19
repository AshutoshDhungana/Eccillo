"""Workflow engine & execution queue (spec §Execution Queue + §Error Recovery).

The orchestrator never fires tool calls ad hoc.  It compiles an
:class:`ExecutionPlan` — a small DAG of skill invocations — and hands it to the
engine, which:

* runs independent steps **concurrently** (bounded by ``max_concurrency``),
* respects declared dependencies,
* checks each step against the :class:`PolicyEngine` (deny / require-approval),
* replays steps whose inputs are unchanged from **plan memory** instead of
  re-running them,
* retries transient (``RETRYABLE_ERROR``) failures,
* blocks steps whose dependencies failed instead of cascading errors,
* records everything on the :class:`Observer`.

It returns a map of ``step_id -> SkillResult`` and never raises.
"""

from __future__ import annotations

import asyncio
import hashlib
import json
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


def _digest(payload: Any) -> str:
    return hashlib.sha256(json.dumps(payload, sort_keys=True, default=str).encode()).hexdigest()[:16]


def _sizes(fields: list[str], snapshot: dict[str, Any]) -> dict[str, int]:
    """How much each produced field currently holds (0 == gone)."""
    out: dict[str, int] = {}
    for name in fields:
        value = snapshot.get(name)
        out[name] = len(value) if isinstance(value, (list, dict, str)) else int(bool(value))
    return out


def _outputs_intact(cached: dict[str, int], current: dict[str, int]) -> bool:
    """A cached step is only reusable while the state it wrote is still there.

    Only fields that *had* content are checked — a skill that legitimately
    produced nothing (no weather advisory, so no risks) stays cacheable.
    """
    return all(current.get(name, 0) > 0 for name, count in cached.items() if count > 0)


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
        memory: Any = None,  # MemoryService; None disables plan memory
        organization_id: str | None = None,
        user_id: str | None = None,
    ):
        self.registry = registry
        self.policy = policy
        self.state = state_manager
        self.event_id = event_id
        self.observer = observer
        self.make_context = make_context
        self.config = config
        self._sem = asyncio.Semaphore(max(1, config.max_concurrency))
        # Plan memory: read once per run (one store round-trip), written back once
        # at the end.  Org/user memory is folded into every fingerprint because
        # skills read it (standing requirements, preferred vendors, writing style).
        self.memory = memory if (memory is not None and config.plan_memory) else None
        self._memo: dict[str, Any] = self.memory.plan_memory(event_id) if self.memory else {}
        self._memo_salt = (
            _digest(self.memory.relevant(organization_id=organization_id, user_id=user_id)) if self.memory else ""
        )
        self._memo_writes: dict[str, Any] = {}
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
        if self._memo_writes and self.memory is not None:
            self.memory.remember_plan(self.event_id, self._memo_writes)
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

        # Plan memory. Skills that produce no event state (email, notification)
        # are side effects, never replayed.
        if self.memory is None or not skill.produces:
            return step.id, await self._run_with_retries(skill, step)

        snapshot = self.state.get(self.event_id).snapshot()
        fingerprint = _digest({
            "salt": self._memo_salt,
            "version": skill.version,
            "inputs": step.inputs,
            "reads": {f: snapshot.get(f) for f in skill.input_fields()},
        })
        entry = self._memo.get(step.skill) or {}
        if entry.get("fingerprint") == fingerprint and _outputs_intact(entry.get("sizes") or {}, _sizes(skill.produces, snapshot)):
            self.observer.incr("skill_cached")
            return step.id, SkillResult(
                step.skill,
                Outcome.SUCCESS,
                data=entry.get("data") or {},
                explanation=list(entry.get("explanation") or []),
                cached=True,
            )

        result = await self._run_with_retries(skill, step)
        if result.ok:
            self._memo_writes[step.skill] = {
                "fingerprint": fingerprint,
                "data": result.data,
                "explanation": result.explanation,
                # Recorded after the run, so it reflects what this skill wrote.
                "sizes": _sizes(skill.produces, self.state.get(self.event_id).snapshot()),
            }
        return step.id, result

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
