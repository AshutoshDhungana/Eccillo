"""AgentRuntime — the orchestrator (spec §Layer 2).

This is the brain.  It maintains state, decides the next action, determines
missing information, routes to skills through backend-owned workflows, validates
outputs, retries failures, controls execution order, and composes the natural
language reply.  The LLM *advises* (intent, wording, summaries); the runtime
*decides*.

One turn is:

    receive message
      → detect intent + extract fields (LLM, structured)
      → update structured event state (state manager)
      → if core info missing: ask ONE deterministic clarifying question
      → else: select a backend workflow, run it (concurrent, policy-gated)
      → advance the state machine
      → compose a grounded natural-language response (LLM)
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from .clarification import next_clarification
from .config import AgentConfig, load_config
from .errors import Outcome
from .llm import build_llm
from .memory import MemoryService
from .observability import Observer
from .policy import PolicyEngine
from .prompts import PromptBuilder
from .registry import CapabilityRegistry
from .services import build_mock_backend
from .skills import SkillContext, default_skills
from .state import EventState, EventStateManager, StructuredEvent, can_transition
from .workflow import ExecutionPlan, PlanStep, WorkflowEngine, select_workflow

_INTENT_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "properties": {
        "intent": {"type": "string", "enum": ["plan_event", "provide_info", "approve", "summary", "email", "other"]},
        "event_type": {"type": ["string", "null"]},
        "extracted_fields": {
            "type": "object",
            "additionalProperties": False,
            "properties": {
                "title": {"type": ["string", "null"]},
                "budget": {"type": ["integer", "null"]},
                "guest_count": {"type": ["integer", "null"]},
                "date": {"type": ["string", "null"]},
                "venue": {"type": ["string", "null"]},
                "location": {"type": ["string", "null"]},
                "currency": {"type": ["string", "null"]},
            },
            "required": ["title", "budget", "guest_count", "date", "venue", "location", "currency"],
        },
        "confidence": {"type": "number"},
    },
    "required": ["intent", "event_type", "extracted_fields", "confidence"],
}


@dataclass
class AgentResponse:
    """Everything one turn produced — message plus full structured context."""

    message: str
    event_id: str
    state: str
    intent: str
    missing_fields: list[str] = field(default_factory=list)
    clarifying: bool = False
    plan: dict[str, Any] | None = None
    results: dict[str, Any] = field(default_factory=dict)
    explanation: list[str] = field(default_factory=list)
    pending_approvals: list[dict[str, Any]] = field(default_factory=list)
    event: dict[str, Any] = field(default_factory=dict)
    observability: dict[str, Any] = field(default_factory=dict)


class AgentRuntime:
    def __init__(
        self,
        *,
        config: AgentConfig | None = None,
        registry: CapabilityRegistry | None = None,
        state_manager: EventStateManager | None = None,
        memory: MemoryService | None = None,
        llm: Any = None,
        backend: Any = None,
        policy: PolicyEngine | None = None,
    ):
        self.config = config or load_config()
        self.llm = llm or build_llm(self.config)
        self.state = state_manager or EventStateManager()
        self.memory = memory or MemoryService(self.state, window=self.config.conversation_window)
        self.backend = backend or build_mock_backend()
        self.policy = policy or PolicyEngine()
        self.prompts = PromptBuilder(conversation_window=self.config.conversation_window)

        if registry is None:
            registry = CapabilityRegistry()
            registry.register_all(default_skills())
        self.registry = registry

        # Per-session memory of the last approval gates reached.
        self._pending: dict[str, list[dict[str, Any]]] = {}

    # -- public API ----------------------------------------------------------
    def create_event(self, **initial: Any) -> StructuredEvent:
        return self.state.create(**initial)

    async def handle_message(
        self,
        *,
        session_id: str,
        event_id: str,
        user_text: str,
        organization_id: str | None = None,
        user_id: str | None = None,
    ) -> AgentResponse:
        observer = Observer(session_id=session_id)
        self.memory.add_turn(session_id, "user", user_text)

        with observer.span("turn", kind="turn", session=session_id):
            intent, event_type, fields = await self._detect_intent(event_id, user_text, observer)

            # Apply extracted state (AI proposes, state manager decides).
            merged = dict(fields)
            if event_type:
                merged["event_type"] = event_type
            self.state.apply_fields(event_id, merged)
            self._ensure_started(event_id)

            event = self.state.get(event_id)

            # Approval flow takes priority when the user confirms.
            if intent == "approve" and self._pending.get(session_id):
                return await self._handle_approval(session_id, event_id, observer, organization_id, user_id)

            # Clarify if core info is still missing (deterministic).
            clar = next_clarification(event)
            if clar.has_question and intent != "summary":
                return await self._ask_clarification(session_id, event, clar, observer, organization_id, user_id)

            # Enough info → advance out of information-gathering, but never
            # regress an event that has already moved past planning.
            if event.status == EventState.COLLECTING_INFO:
                self._try_transition(event_id, EventState.PLANNING)
            event = self.state.get(event_id)

            plan = select_workflow(event, intent=intent)
            if plan is None:
                return await self._respond_summary(session_id, event, observer, intent, organization_id, user_id)

            return await self._execute_plan(session_id, event_id, plan, observer, intent, organization_id, user_id)

    # -- internals -----------------------------------------------------------
    async def _detect_intent(self, event_id: str, user_text: str, observer: Observer) -> tuple[str, str | None, dict[str, Any]]:
        event = self.state.get(event_id)
        manifests = self.registry.manifests(event.status)
        memory = self.memory.relevant(organization_id=event.organization_id, user_id=event.organizer_id)
        turns = self.memory.recent_turns(event_id)
        messages = self.prompts.for_intent(event=event, manifests=manifests, memory=memory, turns=turns, user_text=user_text)
        with observer.span("intent", kind="llm"):
            resp = await self.llm.structured(messages, schema=_INTENT_SCHEMA, schema_name="intent")
            observer.record_tokens(resp.usage)
        data = resp.data or {}
        observer.incr(f"intent:{data.get('intent', 'other')}")
        fields = {k: v for k, v in (data.get("extracted_fields") or {}).items() if v not in (None, "")}
        # Users state budgets in major currency units (e.g. "5,000,000"); the
        # platform stores minor units. Normalize once at intake so the budget
        # skill and every display agree. Guard against the model echoing the
        # already-stored minor value back (which would compound the ×100).
        if fields.get("budget") is not None:
            try:
                raw = int(fields["budget"])
            except (TypeError, ValueError):
                raw = None
            if raw is None or raw == event.budget:
                fields.pop("budget", None)  # unparseable, or an echo of stored state
            else:
                fields["budget"] = raw * 100
        return data.get("intent", "other"), data.get("event_type"), fields

    def _ensure_started(self, event_id: str) -> None:
        event = self.state.get(event_id)
        if event.status == EventState.DRAFT:
            self._try_transition(event_id, EventState.COLLECTING_INFO)

    def _try_transition(self, event_id: str, target: EventState) -> None:
        event = self.state.get(event_id)
        if event.status != target and can_transition(event.status, target):
            self.state.transition(event_id, target)

    async def _ask_clarification(self, session_id, event, clar, observer, org_id, user_id) -> AgentResponse:
        memory = self.memory.relevant(organization_id=org_id, user_id=user_id)
        turns = self.memory.recent_turns(session_id)
        messages = self.prompts.for_clarify(event=event, memory=memory, turns=turns, field=clar.field)
        with observer.span("clarify", kind="llm"):
            resp = await self.llm.complete(messages)
            observer.record_tokens(resp.usage)
        self.memory.add_turn(session_id, "assistant", resp.text)
        observer.incr("clarification")
        return AgentResponse(
            message=resp.text,
            event_id=event.event_id,
            state=event.status.value,
            intent="provide_info",
            missing_fields=clar.missing,
            clarifying=True,
            event=event.snapshot(),
            observability=observer.summary(),
        )

    async def _execute_plan(self, session_id, event_id, plan: ExecutionPlan, observer, intent, org_id, user_id) -> AgentResponse:
        def make_context(skill_name: str, inputs: dict[str, Any]) -> SkillContext:
            return SkillContext(
                event_id=event_id,
                state=self.state,
                memory=self.memory,
                llm=self.llm,
                backend=self.backend,
                observer=observer,
                organization_id=org_id,
                user_id=user_id,
                inputs=inputs,
            )

        engine = WorkflowEngine(
            registry=self.registry,
            policy=self.policy,
            state_manager=self.state,
            event_id=event_id,
            observer=observer,
            make_context=make_context,
            config=self.config,
        )
        results = await engine.execute(plan)

        # Remember approval gates so the next "approve" turn can act on them.
        if engine.pending_approvals:
            self._pending[session_id] = engine.pending_approvals

        # A fully successful plan in PLANNING is ready for human review.
        if all(r.ok or r.outcome == Outcome.NEEDS_APPROVAL for r in results.values()):
            self._try_transition(event_id, EventState.REVIEW)

        event = self.state.get(event_id)
        explanation = self._collect_explanations(results)
        body = self._compose_plan_body(event, results, engine.pending_approvals)
        message = await self._voice(session_id, event, body, observer, org_id, user_id)

        return AgentResponse(
            message=message,
            event_id=event_id,
            state=event.status.value,
            intent=intent,
            plan={"goal": plan.goal, "steps": [{"id": s.id, "skill": s.skill, "depends_on": s.depends_on, "reason": s.reason} for s in plan.steps]},
            results={sid: r.to_dict() for sid, r in results.items()},
            explanation=explanation,
            pending_approvals=engine.pending_approvals,
            event=event.snapshot(),
            observability=observer.summary(),
        )

    async def _handle_approval(self, session_id, event_id, observer, org_id, user_id) -> AgentResponse:
        pending = self._pending.pop(session_id, [])
        self._try_transition(event_id, EventState.APPROVAL)
        skills = [p["skill"] for p in pending]
        plan = ExecutionPlan(goal="Approved actions", steps=[PlanStep(id=s, skill=s, inputs=p.get("inputs", {})) for s, p in zip(skills, pending)])

        def make_context(skill_name: str, inputs: dict[str, Any]) -> SkillContext:
            return SkillContext(event_id=event_id, state=self.state, memory=self.memory, llm=self.llm, backend=self.backend, observer=observer, organization_id=org_id, user_id=user_id, inputs=inputs)

        engine = WorkflowEngine(registry=self.registry, policy=self.policy, state_manager=self.state, event_id=event_id, observer=observer, make_context=make_context, config=self.config)
        engine.approved = set(skills)  # grant approval for exactly these skills
        results = await engine.execute(plan)

        self._try_transition(event_id, EventState.BOOKING)
        event = self.state.get(event_id)
        body = "Approved and executed: " + ", ".join(skills) + "."
        message = await self._voice(session_id, event, body, observer, org_id, user_id)
        return AgentResponse(
            message=message,
            event_id=event_id,
            state=event.status.value,
            intent="approve",
            results={sid: r.to_dict() for sid, r in results.items()},
            explanation=self._collect_explanations(results),
            event=event.snapshot(),
            observability=observer.summary(),
        )

    async def _respond_summary(self, session_id, event, observer, intent, org_id, user_id) -> AgentResponse:
        body = self._compose_summary_body(event)
        memory = self.memory.relevant(organization_id=org_id, user_id=user_id)
        turns = self.memory.recent_turns(session_id)
        messages = self.prompts.for_summary(event=event, memory=memory, turns=turns, fallback_body=body)
        with observer.span("summary", kind="llm"):
            resp = await self.llm.complete(messages)
            observer.record_tokens(resp.usage)
        self.memory.add_turn(session_id, "assistant", resp.text)
        return AgentResponse(
            message=resp.text,
            event_id=event.event_id,
            state=event.status.value,
            intent=intent,
            event=event.snapshot(),
            observability=observer.summary(),
        )

    async def _voice(self, session_id, event, fallback_body, observer, org_id, user_id) -> str:
        memory = self.memory.relevant(organization_id=org_id, user_id=user_id)
        turns = self.memory.recent_turns(session_id)
        messages = self.prompts.for_response(event=event, memory=memory, turns=turns, fallback_body=fallback_body)
        with observer.span("respond", kind="llm"):
            resp = await self.llm.complete(messages)
            observer.record_tokens(resp.usage)
        self.memory.add_turn(session_id, "assistant", resp.text)
        return resp.text

    # -- response composition (deterministic, grounded fallbacks) ------------
    @staticmethod
    def _collect_explanations(results: dict[str, Any]) -> list[str]:
        out: list[str] = []
        for r in results.values():
            out.extend(r.explanation)
        return out

    def _compose_plan_body(self, event: StructuredEvent, results: dict[str, Any], approvals: list[dict]) -> str:
        lines = [f"Here's the plan for {event.title or 'your event'} ({event.event_type or 'event'})."]
        analytics = results.get("analytics")
        if analytics and analytics.ok:
            lines.append(f"Plan readiness: {analytics.data.get('readiness', 0)}%.")
            for c in analytics.data.get("conflicts", []):
                lines.append(f"⚠ {c}")
        counts = {
            "milestones": len(event.timeline),
            "budget categories": len(event.budget_lines),
            "vendors shortlisted": len(event.vendors),
            "tasks": len(event.tasks),
            "guest segments": len(event.guests),
        }
        lines.append("Built: " + ", ".join(f"{v} {k}" for k, v in counts.items() if v))
        failures = [f"{sid} ({r.error})" for sid, r in results.items() if not r.ok and r.outcome != Outcome.NEEDS_APPROVAL]
        if failures:
            lines.append("Couldn't complete: " + ", ".join(failures) + ".")
        if approvals:
            lines.append("Needs your approval before I proceed: " + ", ".join(a["skill"] for a in approvals) + ". Reply 'approve' to continue.")
        return "\n".join(lines)

    def _compose_summary_body(self, event: StructuredEvent) -> str:
        def money(minor: int | None) -> str:
            return f"{event.currency} {minor / 100:,.0f}" if minor else "not set"

        return (
            f"Status: {event.status.value}. Type: {event.event_type or 'unset'}. "
            f"Date: {event.date or 'unset'}. Guests: {event.guest_count or 'unset'}. "
            f"Budget: {money(event.budget)}. "
            f"Timeline: {len(event.timeline)} milestones, {len(event.tasks)} tasks. "
            f"Vendors shortlisted: {len(event.vendors)}. Open risks: {len(event.risks)}."
        )
