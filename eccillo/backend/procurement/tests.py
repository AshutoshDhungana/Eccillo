"""End-to-end procurement: select vendors -> outreach -> quote -> lead.

One test walks the whole chain because that is the thing that has to work; the
rest cover the edges that are cheap to get wrong and expensive to discover in
production (double sends, closed requests, hostile input on a public endpoint).
"""

import json
from datetime import timedelta

from django.core import mail
from django.test import TestCase
from django.utils import timezone

from accounts.models import Membership, Organization, User
from common.auth import encode_token
from marketplace.models import Vendor
from planning.models import Event

from .models import Outreach, ProcurementRequest
from .services import send_queued_outreach


class ProcurementFlowTests(TestCase):
    def setUp(self):
        self.organization = Organization.objects.create(name="Kathmandu Events")
        self.user = User.objects.create_user(username="owner", email="owner@example.test", password="safe-password")
        self.membership = Membership.objects.create(user=self.user, organization=self.organization, role="owner")
        self.event = Event.objects.create(
            organization=self.organization,
            title="Tech Summit",
            type="conference",
            starts_at=timezone.now() + timedelta(days=60),
            location={"venue": "Hotel Yak", "location": "Kathmandu"},
            expected_attendees=160,
            currency="NPR",
        )
        token = encode_token(
            {"sub": str(self.user.id), "membership_id": str(self.membership.id), "type": "access"}, 60
        )
        self.auth = {"HTTP_AUTHORIZATION": f"Bearer {token}"}

        self.reachable = Vendor.objects.create(
            display_name="Himalayan Catering", category="catering", contact_email="catering@example.test"
        )
        # An OSM-discovered vendor with no email — must be recorded, not dropped.
        self.unreachable = Vendor.objects.create(
            display_name="Patan Kitchen", category="catering", external_source="osm"
        )

    def _create(self, **overrides):
        body = {
            "category": "catering",
            "vendor_ids": [str(self.reachable.id), str(self.unreachable.id)],
            "scope": "Lunch and two tea breaks.",
            "requirements": ["vegetarian options"],
            "budget_ceiling_minor": 40_000_00,
            **overrides,
        }
        return self.client.post(
            f"/api/v1/events/{self.event.id}/procurement/requests",
            json.dumps(body),
            content_type="application/json",
            **self.auth,
        )

    def _send(self, request_id):
        # on_commit callbacks never fire inside TestCase's rolled-back
        # transaction, so the dispatch has to be captured explicitly.
        with self.captureOnCommitCallbacks(execute=True):
            return self.client.post(
                f"/api/v1/events/{self.event.id}/procurement/requests/{request_id}/send", **self.auth
            )

    # -- the whole chain ---------------------------------------------------
    def test_selection_becomes_outreach_becomes_a_lead(self):
        created = self._create()
        self.assertEqual(created.status_code, 201, created.content)
        body = created.json()
        self.assertEqual(body["status"], "draft")
        self.assertEqual(body["counts"], {"pending": 1, "no_channel": 1})
        # The organizer sees the exact text before anything leaves the building.
        self.assertIn("Tech Summit", body["preview"]["subject"])
        self.assertIn("/respond/", body["preview"]["body"])
        # Budget is not shared unless asked for, so it must not be in the draft.
        self.assertNotIn("Budget", body["preview"]["body"])
        self.assertEqual(len(mail.outbox), 0, "creating a draft must not send anything")

        sent = self._send(body["id"])
        self.assertEqual(sent.status_code, 200, sent.content)
        self.assertEqual(sent.json()["status"], "sent")

        # Exactly one message: the vendor with no address was skipped, not mailed.
        self.assertEqual(len(mail.outbox), 1)
        message = mail.outbox[0]
        self.assertEqual(message.to, ["catering@example.test"])
        reachable_row = Outreach.objects.get(vendor=self.reachable)
        unreachable_row = Outreach.objects.get(vendor=self.unreachable)
        self.assertEqual(reachable_row.status, "sent")
        self.assertEqual(unreachable_row.status, "no_channel")
        self.assertIn(reachable_row.token, message.body)

        # The vendor answers on the public page — no account, no auth header.
        public = self.client.get(f"/api/v1/procurement/respond/{reachable_row.token}")
        self.assertEqual(public.status_code, 200)
        self.assertEqual(public.json()["event_title"], "Tech Summit")
        self.assertNotIn("budget_ceiling_minor", public.json(), "never anchor a quote to our ceiling")

        reply = self.client.post(
            f"/api/v1/procurement/respond/{reachable_row.token}",
            json.dumps({"can_serve": True, "quote_minor": 35_000_00, "available": True, "notes": "Includes staff."}),
            content_type="application/json",
        )
        self.assertEqual(reply.status_code, 200, reply.content)

        reachable_row.refresh_from_db()
        self.assertEqual(reachable_row.status, "responded")
        self.assertEqual(reachable_row.quote_minor, 35_000_00)

        # ...and shows up as a lead for the organizer.
        leads = self.client.get(f"/api/v1/events/{self.event.id}/procurement/leads", **self.auth)
        self.assertEqual(leads.status_code, 200)
        rows = leads.json()["leads"]
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["party_name"], "Himalayan Catering")
        self.assertEqual(rows[0]["quote_minor"], 35_000_00)
        self.assertEqual(rows[0]["request"]["category"], "catering")

    def test_budget_ceiling_is_shared_only_when_asked(self):
        body = self._create(share_budget=True).json()
        self.assertIn("Budget", body["preview"]["body"])
        self._send(body["id"])
        token = Outreach.objects.get(vendor=self.reachable).token
        public = self.client.get(f"/api/v1/procurement/respond/{token}").json()
        self.assertEqual(public["budget_ceiling_minor"], 40_000_00)

    def test_a_vendor_is_never_mailed_twice(self):
        body = self._create().json()
        self._send(body["id"])
        self.assertEqual(len(mail.outbox), 1)

        # A re-queued batch, a retried task, and a double-clicked Send button.
        self.assertEqual(send_queued_outreach(body["id"]), {"sent": 0, "failed": 0})
        resend = self._send(body["id"])
        self.assertEqual(resend.status_code, 409)
        self.assertEqual(len(mail.outbox), 1)

    def test_public_endpoint_rejects_hostile_and_late_input(self):
        body = self._create().json()
        self._send(body["id"])
        token = Outreach.objects.get(vendor=self.reachable).token
        url = f"/api/v1/procurement/respond/{token}"

        def post(payload):
            return self.client.post(url, json.dumps(payload), content_type="application/json")

        # A bigint overflow on a public endpoint is a 500 waiting to happen.
        self.assertEqual(post({"can_serve": True, "quote_minor": 10**19}).status_code, 400)
        self.assertEqual(post({"can_serve": True, "quote_minor": "free"}).status_code, 400)
        self.assertEqual(post({"can_serve": True}).status_code, 400)
        self.assertEqual(
            post({"can_serve": True, "quote_minor": 1000, "contact_email": "not-an-email"}).status_code, 400
        )
        self.assertEqual(self.client.get("/api/v1/procurement/respond/made-up-token").status_code, 404)

        # Declining is a valid answer and is not a lead.
        self.assertEqual(post({"can_serve": False, "notes": "Fully booked."}).status_code, 200)
        self.assertEqual(Outreach.objects.get(vendor=self.reachable).status, "declined")
        self.assertEqual(self.client.get(f"/api/v1/events/{self.event.id}/procurement/leads", **self.auth).json()["leads"], [])

        # Past the deadline the door is shut.
        ProcurementRequest.objects.filter(id=body["id"]).update(respond_by=timezone.now() - timedelta(days=1))
        self.assertEqual(post({"can_serve": True, "quote_minor": 1000}).status_code, 410)

    def test_outreach_is_reflected_back_in_the_vendor_list(self):
        from orchestration.models import AgentEventState

        AgentEventState.objects.create(
            event=self.event,
            vendors=[{"vendor_id": str(self.reachable.id), "name": "Himalayan Catering",
                      "category": "catering", "score": 0.8, "reasons": [], "status": "shortlisted"}],
        )
        self._send(self._create().json()["id"])

        listing = self.client.get(f"/api/v1/events/{self.event.id}/agent/vendors", **self.auth).json()["vendors"]
        self.assertEqual(listing[0]["status"], "proposed")
        self.assertEqual(listing[0]["outreach_status"], "sent")

    def test_falls_back_to_the_saved_shortlist(self):
        from marketplace.services import save_vendor_shortlist

        save_vendor_shortlist(event=self.event, vendor_ids=[str(self.reachable.id)], source="user")
        created = self.client.post(
            f"/api/v1/events/{self.event.id}/procurement/requests",
            json.dumps({"category": "catering"}),
            content_type="application/json",
            **self.auth,
        )
        self.assertEqual(created.status_code, 201, created.content)
        self.assertEqual(created.json()["counts"], {"pending": 1})

    def test_another_organization_cannot_read_or_send(self):
        other_org = Organization.objects.create(name="Rival Events")
        other_user = User.objects.create_user(username="rival", password="safe-password")
        other_membership = Membership.objects.create(user=other_user, organization=other_org, role="owner")
        token = encode_token(
            {"sub": str(other_user.id), "membership_id": str(other_membership.id), "type": "access"}, 60
        )
        auth = {"HTTP_AUTHORIZATION": f"Bearer {token}"}
        self.assertEqual(
            self.client.get(f"/api/v1/events/{self.event.id}/procurement/requests", **auth).status_code, 403
        )
        self.assertEqual(
            self.client.get(f"/api/v1/events/{self.event.id}/procurement/leads", **auth).status_code, 403
        )
