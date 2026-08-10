"""Offline unit + integration tests for the agent layer.

Run standalone with the project venv (no pytest / no database required)::

    python -m unittest agent.tests.test_agent -v

The agent talks only to real LLM providers; the suite injects a deterministic
``FakeLLM`` test double (see ``agent/tests/fakes.py``) so results are stable in
CI with no network access.
"""

from __future__ import annotations

import asyncio
import unittest

from agent.clarification import next_clarification
from agent.config import AgentConfig
from agent.conversation import ConversationEngine
from agent.errors import Outcome, ProviderNotConfigured, StateTransitionError
from agent.llm import available_providers, build_llm
from agent.llm.gemini_client import to_gemini_schema
from agent.observability import Observer
from agent.policy import Decision, PolicyEngine
from agent.registry import CapabilityRegistry
from agent.runtime import AgentRuntime
from agent.skills import EmailSkill, TimelineSkill, default_skills
from agent.state import (
    EventState,
    EventStateManager,
    StructuredEvent,
    assert_transition,
    can_transition,
)
from agent.tests.fakes import FakeLLM
from agent.workflow import PlanStep, WorkflowEngine
from agent.workflow.engine import ExecutionPlan


def run(coro):
    return asyncio.run(coro)


def fake_runtime() -> AgentRuntime:
    """A runtime wired to the deterministic FakeLLM double (no network)."""
    return AgentRuntime(config=AgentConfig(), llm=FakeLLM())


class StateMachineTests(unittest.TestCase):
    def test_legal_and_illegal_transitions(self):
        self.assertTrue(can_transition(EventState.DRAFT, EventState.COLLECTING_INFO))
        self.assertFalse(can_transition(EventState.DRAFT, EventState.LIVE))
        assert_transition(EventState.PLANNING, EventState.REVIEW)  # should not raise
        with self.assertRaises(StateTransitionError):
            assert_transition(EventState.DRAFT, EventState.BOOKING)

    def test_manager_bumps_revision_and_rejects_unknown(self):
        mgr = EventStateManager()
        ev = mgr.create(title="X")
        r0 = ev.revision
        mgr.apply_fields(ev.event_id, {"guest_count": "250", "nonsense": 1})
        ev = mgr.get(ev.event_id)
        self.assertEqual(ev.guest_count, 250)  # coerced to int
        self.assertFalse(hasattr(ev, "nonsense"))
        self.assertGreater(ev.revision, r0)


class ClarificationTests(unittest.TestCase):
    def test_priority_order(self):
        ev = StructuredEvent(event_type="conference")  # missing guest_count/date/budget/title
        clar = next_clarification(ev)
        # guest_count has higher priority than title/date/budget in the strategy.
        self.assertEqual(clar.field, "guest_count")

    def test_no_question_when_complete(self):
        ev = StructuredEvent(event_type="wedding", title="T", guest_count=10, date="2026-01-01", budget=100)
        self.assertFalse(next_clarification(ev).has_question)


class RegistryAndPolicyTests(unittest.TestCase):
    def setUp(self):
        self.reg = CapabilityRegistry()
        self.reg.register_all(default_skills())

    def test_registry_discovery_and_state_filter(self):
        self.assertTrue(self.reg.has("timeline"))
        available = self.reg.available_in(EventState.DRAFT)
        # timeline is gated to PLANNING/REVIEW; analytics is available anywhere.
        names = {s.name for s in available}
        self.assertIn("analytics", names)
        self.assertNotIn("timeline", names)

    def test_policy_denies_out_of_state_and_gates_email(self):
        policy = PolicyEngine()
        self.assertEqual(policy.evaluate(TimelineSkill(), EventState.DRAFT).decision, Decision.DENY)
        self.assertEqual(policy.evaluate(TimelineSkill(), EventState.PLANNING).decision, Decision.ALLOW)
        self.assertEqual(policy.evaluate(EmailSkill(), EventState.REVIEW).decision, Decision.REQUIRE_APPROVAL)


class SkillTests(unittest.TestCase):
    def _runtime(self) -> AgentRuntime:
        return fake_runtime()

    def test_timeline_requires_date(self):
        rt = self._runtime()
        ev = rt.create_event(event_type="conference")
        rt.state.transition(ev.event_id, EventState.COLLECTING_INFO)
        rt.state.transition(ev.event_id, EventState.PLANNING)
        from agent.skills import TimelineSkill as TS
        from agent.skills.base import SkillContext

        ctx = SkillContext(event_id=ev.event_id, state=rt.state, memory=rt.memory, llm=rt.llm, backend=rt.backend, observer=Observer())
        result = run(TS().run(ctx, {}))
        self.assertEqual(result.outcome, Outcome.VALIDATION_ERROR)  # missing date

    def test_budget_allocation_sums_to_total(self):
        rt = self._runtime()
        ev = rt.create_event(event_type="conference", budget=1_000_000, currency="NPR")
        rt.state.transition(ev.event_id, EventState.COLLECTING_INFO)
        rt.state.transition(ev.event_id, EventState.PLANNING)
        from agent.skills import BudgetSkill
        from agent.skills.base import SkillContext

        ctx = SkillContext(event_id=ev.event_id, state=rt.state, memory=rt.memory, llm=rt.llm, backend=rt.backend, observer=Observer())
        result = run(BudgetSkill().run(ctx, {}))
        self.assertTrue(result.ok)
        total = sum(line["planned_minor"] for line in result.data["budget_lines"])
        self.assertEqual(total, 1_000_000)  # rounding drift reconciled


class WorkflowEngineTests(unittest.TestCase):
    def test_dependency_blocking(self):
        """A step whose dependency fails is blocked, not cascaded into a crash."""
        rt = fake_runtime()
        ev = rt.create_event(event_type="conference")  # no date → timeline fails
        rt.state.transition(ev.event_id, EventState.COLLECTING_INFO)
        rt.state.transition(ev.event_id, EventState.PLANNING)

        from agent.skills.base import SkillContext

        def make_ctx(skill, inputs):
            return SkillContext(event_id=ev.event_id, state=rt.state, memory=rt.memory, llm=rt.llm, backend=rt.backend, observer=Observer(), inputs=inputs)

        plan = ExecutionPlan(goal="t", steps=[
            PlanStep(id="timeline", skill="timeline"),
            PlanStep(id="tasks", skill="tasks", depends_on=["timeline"]),
        ])
        engine = WorkflowEngine(registry=rt.registry, policy=rt.policy, state_manager=rt.state, event_id=ev.event_id, observer=Observer(), make_context=make_ctx, config=rt.config)
        results = run(engine.execute(plan))
        self.assertEqual(results["timeline"].outcome, Outcome.VALIDATION_ERROR)
        self.assertFalse(results["tasks"].ok)
        self.assertIn("blocked", results["tasks"].error)


class ConversationIntegrationTests(unittest.TestCase):
    def test_full_conversation_reaches_review_then_booking(self):
        engine = ConversationEngine(fake_runtime())
        engine.runtime.memory.remember_user("u", {"writing_style": "warm"})
        session = engine.start_session(organization_id="o", user_id="u")

        # Gather info.
        run(engine.send(session.session_id, "Plan a conference"))
        run(engine.send(session.session_id, "200 guests"))
        run(engine.send(session.session_id, "on 2026-09-15 in Kathmandu"))
        resp = run(engine.send(session.session_id, "Call it DevWeek with a budget of 5000000"))

        # Full plan executed → REVIEW, with concrete artifacts on the event.
        self.assertEqual(resp.state, EventState.REVIEW.value)
        ev = engine.event(session.session_id)
        self.assertTrue(ev.timeline and ev.budget_lines and ev.vendors and ev.tasks)
        self.assertGreaterEqual(resp.observability["tokens"]["total"], 0)

        # Email drafting reaches an approval gate.
        resp = run(engine.send(session.session_id, "Draft the invitation email"))
        self.assertTrue(any(a["skill"] == "email" for a in resp.pending_approvals))

        # Approval executes it and advances toward booking.
        resp = run(engine.send(session.session_id, "approve"))
        self.assertEqual(resp.state, EventState.BOOKING.value)

    def test_clarification_before_planning(self):
        engine = ConversationEngine(fake_runtime())
        session = engine.start_session()
        resp = run(engine.send(session.session_id, "I want to plan a hackathon"))
        self.assertTrue(resp.clarifying)
        self.assertEqual(resp.state, EventState.COLLECTING_INFO.value)


class ProviderFactoryTests(unittest.TestCase):
    def test_builtin_providers_registered(self):
        for name in ("openai", "anthropic", "gemini", "ollama"):
            self.assertIn(name, available_providers())

    def test_missing_credential_raises_clear_error(self):
        cfg = AgentConfig(llm_provider="openai", openai_api_key="", openai_base_url="")
        with self.assertRaises(ProviderNotConfigured):
            build_llm(cfg)

    def test_unknown_provider_raises(self):
        with self.assertRaises(ProviderNotConfigured):
            build_llm(AgentConfig(llm_provider="does-not-exist"))

    def test_ollama_builds_without_key(self):
        client = build_llm(AgentConfig(llm_provider="ollama", llm_model="llama3.1"))
        self.assertEqual(client.provider, "ollama")
        self.assertEqual(client.model, "llama3.1")

    def test_openai_compatible_via_base_url_needs_no_key(self):
        client = build_llm(AgentConfig(llm_provider="openai", openai_api_key="", openai_base_url="http://localhost:1234/v1"))
        self.assertEqual(client.provider, "openai")

    def test_default_model_resolution(self):
        self.assertEqual(AgentConfig(llm_provider="gemini").model_for("gemini"), "gemini-2.0-flash")
        self.assertEqual(AgentConfig(llm_model="custom").model_for("gemini"), "custom")

    def test_gemini_schema_conversion(self):
        converted = to_gemini_schema({
            "type": "object",
            "additionalProperties": False,
            "properties": {
                "intent": {"type": "string", "enum": ["a", "b"]},
                "budget": {"type": ["integer", "null"]},
            },
            "required": ["intent", "budget"],
        })
        self.assertEqual(converted["type"], "OBJECT")
        self.assertNotIn("additionalProperties", converted)
        self.assertEqual(converted["properties"]["intent"]["type"], "STRING")
        self.assertEqual(converted["properties"]["intent"]["enum"], ["a", "b"])
        self.assertEqual(converted["properties"]["budget"]["type"], "INTEGER")
        self.assertTrue(converted["properties"]["budget"]["nullable"])


if __name__ == "__main__":
    unittest.main()
