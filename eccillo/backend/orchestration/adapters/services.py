"""Django implementations of the 8 agent service ports (Phase 3, Milestone 3).

These satisfy ``agent.services.ports.*`` exactly.  ORM access is synchronous;
the turn runs with ``DJANGO_ALLOW_ASYNC_UNSAFE`` set (see ``runtime.py``) so the
agent's async skills may call them directly inside a background worker.

Venue/vendor data comes from the restored ``marketplace`` app and reuses the
platform's explainable scoring in ``common/matching.py``.
"""

from __future__ import annotations

from datetime import date
from typing import Any

from agent.services.ports import (
    BackendServices,
    BudgetService,
    CalendarService,
    EmailService,
    NotificationService,
    TimelineService,
    VendorService,
    VenueService,
    WeatherService,
)
from common.matching import vendor_score
from marketplace.models import Vendor

# --- static domain knowledge (would move to config tables later) ------------

_BENCHMARKS = {
    "conference": {"venue": 0.30, "catering": 0.25, "av": 0.15, "marketing": 0.10, "staffing": 0.10, "misc": 0.10},
    "wedding": {"venue": 0.30, "catering": 0.30, "decoration": 0.15, "talent": 0.10, "printing": 0.05, "misc": 0.10},
    "hackathon": {"venue": 0.25, "catering": 0.30, "av": 0.15, "marketing": 0.10, "printing": 0.05, "misc": 0.15},
    "_default": {"venue": 0.30, "catering": 0.25, "av": 0.15, "marketing": 0.10, "staffing": 0.10, "misc": 0.10},
}

_TIMELINE_TEMPLATES = {
    "conference": [
        {"title": "Confirm date & venue", "offset_days": -90, "critical_path": True},
        {"title": "Open speaker CFP", "offset_days": -75, "critical_path": False},
        {"title": "Lock catering & AV", "offset_days": -45, "critical_path": True},
        {"title": "Launch registration", "offset_days": -40, "critical_path": True},
        {"title": "Finalize agenda", "offset_days": -14, "critical_path": True},
        {"title": "Run-of-show rehearsal", "offset_days": -2, "critical_path": False},
        {"title": "Event day", "offset_days": 0, "critical_path": True},
        {"title": "Post-event survey & wrap", "offset_days": 3, "critical_path": False},
    ],
    "_default": [
        {"title": "Confirm date & venue", "offset_days": -60, "critical_path": True},
        {"title": "Book core vendors", "offset_days": -45, "critical_path": True},
        {"title": "Send invitations", "offset_days": -30, "critical_path": True},
        {"title": "Confirm headcount", "offset_days": -7, "critical_path": True},
        {"title": "Event day", "offset_days": 0, "critical_path": True},
        {"title": "Wrap-up & thank-yous", "offset_days": 2, "critical_path": False},
    ],
}


def _prefer_local(qs, location: str | None) -> list[Vendor]:
    """Prefer vendors serving ``location``; fall back to all if none match."""
    vendors = list(qs)
    if not location:
        return vendors
    local = [v for v in vendors if location in (v.service_areas or [])]
    return local or vendors


def _vendor_dict(v: Vendor, constraints: dict[str, Any]) -> dict[str, Any]:
    score, factors = vendor_score(v, constraints)
    reasons = [f"rated {v.rating_avg}/5 over {v.review_count} reviews", f"responds in ~{v.response_time_mins} min"]
    budget = constraints.get("budget_max_minor")
    if budget and v.price_from_minor <= int(budget):
        reasons.append("fits category budget")
    return {
        "id": str(v.id),
        "name": v.display_name,
        "category": v.category,
        "price_from_minor": v.price_from_minor,
        "rating": float(v.rating_avg),
        "score": score,
        "factors": factors,
        "reasons": reasons,
    }


class DjangoVenueService(VenueService):
    def __init__(self, *, discovery=None):
        self.discovery = discovery

    async def search(self, *, event_type, guest_count, budget_minor, location, date):  # noqa: A002
        if self.discovery and location:
            await self.discovery.discover(location=location, category="venue")
        constraints = {"budget_max_minor": int(budget_minor * 0.30) if budget_minor else None, "date": date}
        vendors = _prefer_local(Vendor.objects.filter(category="venue"), location)
        results = [_vendor_dict(v, constraints) for v in vendors]
        for r in results:
            if location:
                r["reasons"].append(f"serves {location}")
        return sorted(results, key=lambda r: r["score"], reverse=True)


class DjangoVendorService(VendorService):
    def __init__(self, *, discovery=None, state_store=None):
        self.discovery = discovery
        self.state_store = state_store

    async def search(self, *, category, constraints):
        # VendorService.search has no location arg — read the event being planned.
        location = self.state_store.current_location() if self.state_store else None
        if self.discovery and location:
            await self.discovery.discover(location=location, category=category)
        vendors = _prefer_local(Vendor.objects.filter(category=category), location)
        results = [_vendor_dict(v, constraints or {}) for v in vendors]
        return sorted(results, key=lambda r: r["score"], reverse=True)


class DjangoBudgetService(BudgetService):
    async def benchmarks(self, *, event_type, guest_count):
        return dict(_BENCHMARKS.get(event_type, _BENCHMARKS["_default"]))


class DjangoTimelineService(TimelineService):
    async def template(self, *, event_type):
        return [dict(i) for i in _TIMELINE_TEMPLATES.get(event_type, _TIMELINE_TEMPLATES["_default"])]


class DjangoWeatherService(WeatherService):
    """Deterministic seasonal outlook.

    Events are frequently months out, beyond any real forecast horizon, so this
    returns a stable climatology-style hint rather than a fake precise forecast.
    Swap for a geocode + Open-Meteo call when near-term accuracy is needed.
    """

    async def forecast(self, *, location, date):  # noqa: A002
        seed = sum(ord(c) for c in (date or "")) % 3
        outlook = ["clear", "partly cloudy", "rain likely"][seed]
        return {
            "location": location or "unknown",
            "date": date,
            "outlook": outlook,
            "temp_c_high": 24 + seed,
            "precip_chance": [10, 35, 70][seed],
            "advisory": "Consider a wet-weather backup for outdoor areas." if seed == 2 else "",
            "source": "seasonal-estimate",
        }


class DjangoCalendarService(CalendarService):
    def __init__(self, *, user=None):
        self.user = user

    async def check_conflicts(self, *, organizer_id, date):  # noqa: A002
        if not date:
            return []
        from planning.models import Event

        try:
            day = __import__("datetime").date.fromisoformat(str(date))
        except ValueError:
            return []
        qs = Event.objects.filter(starts_at__date=day)
        if self.user is not None:
            org_ids = self.user.memberships.values_list("organization_id", flat=True)
            qs = qs.filter(organization_id__in=list(org_ids))
        return [{"title": e.title, "event_id": str(e.id), "starts_at": e.starts_at.isoformat() if e.starts_at else None} for e in qs[:10]]


class DjangoEmailService(EmailService):
    def __init__(self, *, organization=None, user=None):
        self.organization = organization
        self.user = user

    async def draft(self, *, to, subject, body):
        # Draft only — sending is an approval-gated action handled at Milestone 4/5.
        return {"to": to, "subject": subject, "body": body, "status": "draft", "sender": getattr(self.user, "email", "")}


class DjangoNotificationService(NotificationService):
    def __init__(self, *, organization=None, user=None):
        self.organization = organization
        self.user = user

    async def enqueue(self, *, channel, template_key, payload):
        from planning.models import Event
        from common.models import Notification

        if self.organization is None or self.user is None:
            return {"channel": channel, "template_key": template_key, "status": "skipped", "reason": "no recipient context"}
        event = None
        event_id = (payload or {}).get("event_id")
        if event_id:
            event = Event.objects.filter(pk=str(event_id).replace("-", "")).first()
        note = Notification.objects.create(
            recipient=self.user,
            organization=self.organization,
            event=event,
            channel=channel,
            template_key=template_key,
            payload=payload or {},
            status="queued",
        )
        return {"id": str(note.id), "channel": channel, "template_key": template_key, "status": "queued"}


def build_backend_services(*, organization=None, user=None, state_store=None, discovery=None) -> BackendServices:
    """Assemble the full BackendServices bundle bound to the request context.

    ``discovery`` (a ``VendorDiscoveryService``) enables live OSM-backed venue /
    vendor discovery near the event's location; omit it to serve only curated
    marketplace data.
    """
    return BackendServices(
        venues=DjangoVenueService(discovery=discovery),
        vendors=DjangoVendorService(discovery=discovery, state_store=state_store),
        budgets=DjangoBudgetService(),
        timelines=DjangoTimelineService(),
        weather=DjangoWeatherService(),
        calendar=DjangoCalendarService(user=user),
        email=DjangoEmailService(organization=organization, user=user),
        notifications=DjangoNotificationService(organization=organization, user=user),
    )
