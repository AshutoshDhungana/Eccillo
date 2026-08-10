from django.test import TestCase
from django.utils import timezone
from accounts.models import Organization, User, Membership
from common.auth import encode_token, decode_token
from marketplace.models import Vendor
from common.matching import vendor_score
from planning.models import Event, Task
from planning.services import calculate_critical_path


class CoreDomainTests(TestCase):
    def setUp(self):
        self.org = Organization.objects.create(name="Organizer")
        self.user = User.objects.create_user(username="owner", password="safe-password")
        self.membership = Membership.objects.create(user=self.user, organization=self.org, role="owner")
        self.event = Event.objects.create(organization=self.org, title="Test event")

    def test_access_token_round_trip(self):
        token = encode_token({"sub": str(self.user.id), "membership_id": str(self.membership.id), "type": "access"}, 60)
        self.assertEqual(decode_token(token)["sub"], str(self.user.id))

    def test_vendor_score_is_explainable_and_bounded(self):
        vendor = Vendor.objects.create(display_name="Venue", category="venue", rating_avg=4.5, review_count=10, response_time_mins=60, price_from_minor=1000, verification_status="verified")
        score, factors = vendor_score(vendor, {"budget_max": 1500})
        self.assertGreaterEqual(score, 0); self.assertLessEqual(score, 1)
        self.assertEqual(set(factors), {"budget", "reviews", "response_time", "experience", "availability"})

    def test_task_cycle_is_rejected(self):
        first = Task.objects.create(event=self.event, title="First")
        second = Task.objects.create(event=self.event, title="Second", depends_on=first)
        first.depends_on = second; first.save()
        with self.assertRaises(ValueError):
            calculate_critical_path(self.event)

    def test_events_are_scoped_to_active_jwt_organization(self):
        other = Organization.objects.create(name="Other")
        Event.objects.create(organization=other, title="Private event")
        token = encode_token({"sub": str(self.user.id), "membership_id": str(self.membership.id), "type": "access"}, 60)
        response = self.client.get("/api/v1/events", HTTP_AUTHORIZATION=f"Bearer {token}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual([row["id"] for row in response.json()], [str(self.event.id)])
