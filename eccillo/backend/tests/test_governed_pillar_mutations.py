import json

from django.test import TestCase
from django.utils import timezone

from accounts.models import Membership, Organization, User
from common.auth import encode_token
from common.models import DomainEvent
from marketplace.models import Vendor
from operations.models import TicketType
from planning.models import Event


class GovernedPillarMutationEndpointTests(TestCase):
    def setUp(self):
        self.organization = Organization.objects.create(name="Organizer")
        self.user = User.objects.create_user(username="owner", password="safe-password")
        self.membership = Membership.objects.create(
            user=self.user,
            organization=self.organization,
            role="owner",
        )
        self.event = Event.objects.create(organization=self.organization, title="Mutation test")
        token = encode_token(
            {"sub": str(self.user.id), "membership_id": str(self.membership.id), "type": "access"},
            60,
        )
        self.auth = {"HTTP_AUTHORIZATION": f"Bearer {token}"}

    def test_planning_and_operations_writes_advance_revision_and_outbox(self):
        initial_revision = self.event.revision
        milestone = self.client.post(
            f"/api/v1/events/{self.event.id}/milestones",
            {"title": "Book venue"},
            format="json",
            **self.auth,
        )
        self.assertEqual(milestone.status_code, 201)
        self.event.refresh_from_db()
        self.assertGreater(self.event.revision, initial_revision)
        self.assertTrue(
            DomainEvent.objects.filter(
                event=self.event,
                type="planning.milestone.created",
            ).exists()
        )

        ticket_type = self.client.post(
            f"/api/v1/operations/events/{self.event.id}/ticket-types",
            {"name": "Community", "price_minor": 0, "currency": "NPR"},
            format="json",
            **self.auth,
        )
        self.assertEqual(ticket_type.status_code, 201)
        self.assertTrue(
            DomainEvent.objects.filter(
                event=self.event,
                type="operations.ticket_type.created",
            ).exists()
        )

    def test_rfp_draft_is_event_scoped_and_public_effects_are_blocked(self):
        response = self.client.post(
            f"/api/v1/events/{self.event.id}/rfps",
            json.dumps(
                {
                    "category": "venue",
                    "title": "Venue RFP",
                    "scope": "Need a venue",
                    "requirements": ["seating"],
                    "budget_ceiling_minor": 10000,
                    "currency": "NPR",
                    "deadline_at": timezone.now().isoformat(),
                }
            ),
            content_type="application/json",
            **self.auth,
        )
        self.assertEqual(response.status_code, 201, response.json())
        self.assertTrue(
            DomainEvent.objects.filter(
                event=self.event,
                type="procurement.rfp.created",
            ).exists()
        )

        publish = self.client.patch(
            f"/api/v1/events/{self.event.id}",
            json.dumps({"status": "published"}),
            content_type="application/json",
            **self.auth,
        )
        self.assertEqual(publish.status_code, 409)

        payment = self.client.post("/api/v1/payments/intents", {}, format="json", **self.auth)
        self.assertEqual(payment.status_code, 409)

        vendor = Vendor.objects.create(display_name="Venue", category="venue")
        hold = self.client.post(
            f"/api/v1/marketplace/vendors/{vendor.id}/availability",
            {"starts_at": timezone.now().isoformat(), "ends_at": timezone.now().isoformat()},
            format="json",
            **self.auth,
        )
        self.assertEqual(hold.status_code, 409)

    def test_free_checkout_uses_event_mutation_and_paid_checkout_is_blocked(self):
        self.event.status = "published"
        self.event.save()
        free = TicketType.objects.create(event=self.event, name="Free", price_minor=0, currency="NPR")
        paid = TicketType.objects.create(event=self.event, name="Paid", price_minor=100, currency="NPR")

        checkout = self.client.post(
            f"/api/v1/operations/events/{self.event.id}/orders",
            json.dumps(
                {
                    "buyer": {"name": "Guest", "email": "guest@example.test"},
                    "items": [{"ticket_type_id": str(free.id), "qty": 1}],
                }
            ),
            content_type="application/json",
        )
        self.assertEqual(checkout.status_code, 201, checkout.content)
        self.assertEqual(checkout.json()["order"]["total_minor"], 0)
        self.assertTrue(
            DomainEvent.objects.filter(
                event=self.event,
                type="operations.ticket_order.created",
            ).exists()
        )

        paid_checkout = self.client.post(
            f"/api/v1/operations/events/{self.event.id}/orders",
            json.dumps(
                {
                    "buyer": {"name": "Guest", "email": "guest@example.test"},
                    "items": [{"ticket_type_id": str(paid.id), "qty": 1}],
                }
            ),
            content_type="application/json",
        )
        self.assertEqual(paid_checkout.status_code, 409)
