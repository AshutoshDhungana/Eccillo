"""Backend service ports — the integration seam (Layer 4).

Skills depend only on these abstract ports, never on Django models or DRF views.
Today they are backed by :mod:`agent.services.mock_backend`.  In a later phase
each port is reimplemented to call the real Eccillo services
(``planning`` mutations, vendor marketplace, email/notification, maps, weather)
and no skill or orchestrator code has to change.

This is the concrete expression of spec §3 ("the backend owns workflows") and
§Guiding Principle 2 ("the backend executes").
"""

from __future__ import annotations

import abc
from typing import Any


class VenueService(abc.ABC):
    @abc.abstractmethod
    async def search(self, *, event_type: str, guest_count: int | None, budget_minor: int | None, location: str | None, date: str | None) -> list[dict[str, Any]]:
        ...


class VendorService(abc.ABC):
    @abc.abstractmethod
    async def search(self, *, category: str, constraints: dict[str, Any]) -> list[dict[str, Any]]:
        ...


class BudgetService(abc.ABC):
    @abc.abstractmethod
    async def benchmarks(self, *, event_type: str, guest_count: int | None) -> dict[str, float]:
        """Return category -> fraction-of-budget benchmarks for the event type."""


class TimelineService(abc.ABC):
    @abc.abstractmethod
    async def template(self, *, event_type: str) -> list[dict[str, Any]]:
        """Return an ordered milestone template for the event type."""


class WeatherService(abc.ABC):
    @abc.abstractmethod
    async def forecast(self, *, location: str | None, date: str | None) -> dict[str, Any]:
        ...


class CalendarService(abc.ABC):
    @abc.abstractmethod
    async def check_conflicts(self, *, organizer_id: str | None, date: str | None) -> list[dict[str, Any]]:
        ...


class EmailService(abc.ABC):
    @abc.abstractmethod
    async def draft(self, *, to: list[str], subject: str, body: str) -> dict[str, Any]:
        """Prepare an email.  Never sends — sending is an approval-gated action."""


class NotificationService(abc.ABC):
    @abc.abstractmethod
    async def enqueue(self, *, channel: str, template_key: str, payload: dict[str, Any]) -> dict[str, Any]:
        ...


class BackendServices:
    """Aggregates every port the skills need.  Passed into each SkillContext."""

    def __init__(
        self,
        *,
        venues: VenueService,
        vendors: VendorService,
        budgets: BudgetService,
        timelines: TimelineService,
        weather: WeatherService,
        calendar: CalendarService,
        email: EmailService,
        notifications: NotificationService,
    ):
        self.venues = venues
        self.vendors = vendors
        self.budgets = budgets
        self.timelines = timelines
        self.weather = weather
        self.calendar = calendar
        self.email = email
        self.notifications = notifications
