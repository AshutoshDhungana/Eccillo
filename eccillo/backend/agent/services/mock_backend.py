"""Deterministic in-memory implementations of the backend ports.

These stand in for the real Eccillo services so the agent layer runs end-to-end
with no database.  The data is plausible and stable (seeded, no randomness) so
demos and tests are reproducible.  Vendor scoring mirrors the explainable model
already used by the platform (``backend/common/matching.py``).
"""

from __future__ import annotations

from typing import Any

from .ports import (
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

_VENUES = [
    {"id": "ven_1", "name": "Hyatt Regency Grand Ballroom", "capacity": 800, "price_from_minor": 45_00_000, "rating": 4.7, "location": "Kathmandu", "indoor": True},
    {"id": "ven_2", "name": "Soaltee Convention Center", "capacity": 500, "price_from_minor": 30_00_000, "rating": 4.5, "location": "Kathmandu", "indoor": True},
    {"id": "ven_3", "name": "Godavari Village Resort Lawns", "capacity": 300, "price_from_minor": 18_00_000, "rating": 4.4, "location": "Lalitpur", "indoor": False},
    {"id": "ven_4", "name": "Trade Tower Rooftop", "capacity": 150, "price_from_minor": 9_00_000, "rating": 4.2, "location": "Kathmandu", "indoor": False},
]

_VENDORS = {
    "catering": [
        {"id": "cat_1", "name": "Kathmandu Catering Co.", "price_from_minor": 12_00_000, "rating": 4.6, "response_mins": 120, "reviews": 84},
        {"id": "cat_2", "name": "Everest Feasts", "price_from_minor": 8_00_000, "rating": 4.3, "response_mins": 300, "reviews": 41},
    ],
    "av": [
        {"id": "av_1", "name": "StageCraft AV", "price_from_minor": 6_00_000, "rating": 4.8, "response_mins": 60, "reviews": 120},
        {"id": "av_2", "name": "SoundPeak Rentals", "price_from_minor": 3_50_000, "rating": 4.1, "response_mins": 240, "reviews": 33},
    ],
    "decoration": [
        {"id": "dec_1", "name": "Bloom & Co Decor", "price_from_minor": 5_00_000, "rating": 4.5, "response_mins": 180, "reviews": 57},
    ],
    "photography": [
        {"id": "pho_1", "name": "Frame Studio", "price_from_minor": 2_50_000, "rating": 4.9, "response_mins": 90, "reviews": 210},
    ],
}

# Category share of total budget by event type (fractions sum to ~1).
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


def _clamp(v: float) -> float:
    return round(max(0.0, min(1.0, v)), 3)


class MockVenueService(VenueService):
    async def search(self, *, event_type, guest_count, budget_minor, location, date):
        results = []
        for v in _VENUES:
            reasons = []
            fits_capacity = guest_count is None or v["capacity"] >= guest_count
            if fits_capacity:
                reasons.append(f"capacity {v['capacity']} ≥ {guest_count or 'n/a'} guests")
            venue_budget = int((budget_minor or 0) * 0.30) or None
            fits_budget = venue_budget is None or v["price_from_minor"] <= venue_budget
            if fits_budget and venue_budget:
                reasons.append("within ~30% venue budget")
            if location and v["location"].lower() == location.lower():
                reasons.append(f"located in {location}")
            reasons.append(f"rated {v['rating']}/5")
            score = _clamp(
                0.4 * (1 if fits_capacity else 0)
                + 0.3 * (1 if fits_budget else 0)
                + 0.2 * (v["rating"] / 5)
                + 0.1 * (1 if location and v["location"].lower() == location.lower() else 0)
            )
            results.append({**v, "score": score, "reasons": reasons})
        return sorted(results, key=lambda r: r["score"], reverse=True)


class MockVendorService(VendorService):
    async def search(self, *, category, constraints):
        budget = constraints.get("budget_max_minor")
        out = []
        for v in _VENDORS.get(category, []):
            factors = {
                "budget": 1.0 if not budget else _clamp(1 - max(0, v["price_from_minor"] - int(budget)) / max(int(budget), 1)),
                "reviews": _clamp(v["rating"] / 5),
                "response_time": _clamp(1 - v["response_mins"] / 2880),
                "experience": _clamp(min(v["reviews"], 20) / 20),
                "availability": 1.0,
            }
            weights = {"budget": 0.3, "reviews": 0.25, "response_time": 0.1, "experience": 0.2, "availability": 0.15}
            score = _clamp(sum(factors[k] * weights[k] for k in weights))
            reasons = [
                f"rated {v['rating']}/5 over {v['reviews']} reviews",
                f"responds in ~{v['response_mins']} min",
            ]
            if budget and v["price_from_minor"] <= budget:
                reasons.append("fits category budget")
            out.append({**v, "category": category, "score": score, "factors": factors, "reasons": reasons})
        return sorted(out, key=lambda r: r["score"], reverse=True)


class MockBudgetService(BudgetService):
    async def benchmarks(self, *, event_type, guest_count):
        return dict(_BENCHMARKS.get(event_type, _BENCHMARKS["_default"]))


class MockTimelineService(TimelineService):
    async def template(self, *, event_type):
        return [dict(item) for item in _TIMELINE_TEMPLATES.get(event_type, _TIMELINE_TEMPLATES["_default"])]


class MockWeatherService(WeatherService):
    async def forecast(self, *, location, date):
        # Stable pseudo-forecast keyed off the date string so tests are repeatable.
        seed = sum(ord(c) for c in (date or "")) % 3
        outlook = ["clear", "partly cloudy", "rain likely"][seed]
        return {
            "location": location or "unknown",
            "date": date,
            "outlook": outlook,
            "temp_c_high": 24 + seed,
            "precip_chance": [10, 35, 70][seed],
            "advisory": "Consider a wet-weather backup for outdoor areas." if seed == 2 else "",
        }


class MockCalendarService(CalendarService):
    async def check_conflicts(self, *, organizer_id, date):
        return []  # no conflicts in the mock world


class MockEmailService(EmailService):
    async def draft(self, *, to, subject, body):
        return {"to": to, "subject": subject, "body": body, "status": "draft"}


class MockNotificationService(NotificationService):
    async def enqueue(self, *, channel, template_key, payload):
        return {"channel": channel, "template_key": template_key, "payload": payload, "status": "queued"}


def build_mock_backend() -> BackendServices:
    return BackendServices(
        venues=MockVenueService(),
        vendors=MockVendorService(),
        budgets=MockBudgetService(),
        timelines=MockTimelineService(),
        weather=MockWeatherService(),
        calendar=MockCalendarService(),
        email=MockEmailService(),
        notifications=MockNotificationService(),
    )
