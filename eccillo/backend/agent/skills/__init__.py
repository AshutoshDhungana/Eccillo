"""The default skill catalogue (spec §Layer 3 & Phase 2 Deliverables → Skills)."""

from .analytics import AnalyticsSkill
from .base import Skill, SkillContext, SkillResult
from .budget import BudgetSkill
from .comms import CalendarSkill, EmailSkill, NotificationSkill
from .guest import GuestSkill
from .logistics import LogisticsSkill
from .planning import PlanningSkill
from .tasks import TaskSkill
from .timeline import TimelineSkill
from .vendor import VendorRecommendationSkill
from .venue import VenueRecommendationSkill


def default_skills() -> list[Skill]:
    """Instantiate one of every built-in skill, ready to register."""
    return [
        PlanningSkill(),
        TimelineSkill(),
        BudgetSkill(),
        TaskSkill(),
        VenueRecommendationSkill(),
        VendorRecommendationSkill(),
        GuestSkill(),
        LogisticsSkill(),
        AnalyticsSkill(),
        CalendarSkill(),
        EmailSkill(),
        NotificationSkill(),
    ]


__all__ = [
    "Skill",
    "SkillContext",
    "SkillResult",
    "default_skills",
    "PlanningSkill",
    "TimelineSkill",
    "BudgetSkill",
    "TaskSkill",
    "VenueRecommendationSkill",
    "VendorRecommendationSkill",
    "GuestSkill",
    "LogisticsSkill",
    "AnalyticsSkill",
    "CalendarSkill",
    "EmailSkill",
    "NotificationSkill",
]
