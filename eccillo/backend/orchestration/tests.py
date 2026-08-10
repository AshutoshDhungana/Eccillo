"""Integration tests for the agent Conversation API (Phase 3).

Run with the Django test runner (test settings force Celery eager mode and an
in-memory DB)::

    python manage.py test orchestration --settings=config.settings.test

The frozen agent talks only to real providers, so these tests register a
deterministic ``FakeLLM`` provider and run with discovery disabled — fully
offline and stable.
"""

import json
import os

from django.test import TransactionTestCase, override_settings

from accounts.models import Membership, Organization, User
from agent.llm import register_provider
from agent.tests.fakes import FakeLLM
from common.auth import encode_token
from planning.models import BudgetLineItem, Event, Milestone


def _register_fake_provider():
    register_provider("fake", lambda cfg: FakeLLM())


@override_settings(AGENT_DISCOVERY_ENABLED=False)
class ConversationAPITests(TransactionTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        _register_fake_provider()
        cls._prev = {k: os.environ.get(k) for k in ("AGENT_LLM_PROVIDER", "AGENT_MAX_CONCURRENCY")}
        os.environ["AGENT_LLM_PROVIDER"] = "fake"
        os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"
        # The SQLite test DB is a single shared connection; the agent's concurrent
        # skills would collide on it. Serialize them for tests (Postgres is fine).
        os.environ["AGENT_MAX_CONCURRENCY"] = "1"

    @classmethod
    def tearDownClass(cls):
        for key, value in cls._prev.items():
            if value is None:
                os.environ.pop(key, None)
            else:
                os.environ[key] = value
        super().tearDownClass()

    def setUp(self):
        self.org = Organization.objects.create(name="Acme Events")
        self.user = User.objects.create(username="planner", email="planner@acme.test")
        self.membership = Membership.objects.create(user=self.user, organization=self.org, role="owner")
        self.event = Event.objects.create(organization=self.org, title="Untitled", type="other")
        token = encode_token(
            {"sub": str(self.user.id), "membership_id": str(self.membership.id),
             "organization_id": str(self.org.id), "role": "owner", "type": "access"},
            3600,
        )
        self.auth = {"HTTP_AUTHORIZATION": f"Bearer {token}"}
        self.base = f"/api/v1/events/{self.event.id}/agent"

    def _send(self, message, session_id=None):
        body = {"message": message}
        if session_id:
            body["session_id"] = session_id
        return self.client.post(self.base + "/messages", data=json.dumps(body), content_type="application/json", **self.auth)

    def _drive_to_review(self):
        r = self._send("Plan a conference")
        sid = r.json()["session_id"]
        for msg in ["200 guests", "on 2026-09-15 in Kathmandu", "Call it DevWeek with a budget of 5000000"]:
            self._send(msg, sid)
        return sid

    def test_auth_required(self):
        r = self.client.post(self.base + "/messages", data=json.dumps({"message": "hi"}), content_type="application/json")
        self.assertIn(r.status_code, (401, 403))

    def test_message_returns_202_and_run_completes(self):
        r = self._send("Plan a conference")
        self.assertEqual(r.status_code, 202)
        data = r.json()
        self.assertEqual(data["status"], "queued")
        run = self.client.get(f"{self.base}/runs/{data['run_id']}", **self.auth).json()
        self.assertEqual(run["status"], "completed")
        self.assertTrue(run["clarifying"])  # first turn asks a question
        self.assertEqual(run["ai_state"], "collecting_information")

    def test_full_conversation_persists_plan(self):
        sid = self._drive_to_review()
        state = self.client.get(f"{self.base}/state", **self.auth).json()
        self.assertEqual(state["status"], "review")
        self.assertGreaterEqual(len(state["timeline"]), 1)
        # Canonical planning tables were written through the hybrid store.
        self.assertGreater(Milestone.objects.filter(event=self.event).count(), 0)
        self.assertGreater(BudgetLineItem.objects.filter(event=self.event).count(), 0)
        transcript = self.client.get(f"{self.base}/sessions/{sid}/messages", **self.auth).json()
        self.assertEqual(len(transcript), 8)  # 4 user + 4 assistant

    def test_email_approval_flow(self):
        sid = self._drive_to_review()
        r = self._send("Draft the invitation email", sid)
        run = self.client.get(f"{self.base}/runs/{r.json()['run_id']}", **self.auth).json()
        self.assertTrue(any(a["skill"] == "email" for a in run["pending_approvals"]))

        # A governed ApprovalChain was recorded.
        from common.models import ApprovalChain

        self.assertTrue(ApprovalChain.objects.filter(resource_type="agent.action").exists())

        # Approving executes the gated skill and advances the workflow.
        ar = self.client.post(f"{self.base}/sessions/{sid}/approve", **self.auth)
        self.assertEqual(ar.status_code, 202)
        approved_run = self.client.get(f"{self.base}/runs/{ar.json()['run_id']}", **self.auth).json()
        self.assertEqual(approved_run["status"], "completed")
        self.assertEqual(approved_run["ai_state"], "booking")

    def test_outbox_dispatcher_delivers(self):
        from common.api import emit
        from common.models import DomainEvent
        from orchestration.tasks import dispatch_outbox

        emit("agent.test.fact", self.org, self.event, self.user, {"x": 1})
        self.assertEqual(DomainEvent.objects.filter(delivery_status="pending").count(), 1)
        delivered = dispatch_outbox()
        self.assertEqual(delivered, 1)
        self.assertEqual(DomainEvent.objects.filter(delivery_status="delivered").count(), 1)
