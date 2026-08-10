from django.db import models

from accounts.models import Organization, User
from common.models import BaseModel


EVENT_TYPES = [(value, value.title()) for value in ["birthday", "wedding", "conference", "hackathon", "festival", "workshop", "sports", "meetup", "seminar", "other"]]
SOURCE_CHOICES = [(value, value.title()) for value in ["user", "template", "ai"]]
BUDGET_CATEGORIES = [(value, value.replace("_", " ").title()) for value in ["venue", "catering", "av", "marketing", "talent", "sponsorship", "staffing", "printing", "transport", "accommodation", "decoration", "misc"]]


class EventTemplate(BaseModel):
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=EVENT_TYPES)
    blueprint = models.JSONField(default=dict)
    is_public = models.BooleanField(default=True)


class Event(BaseModel):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="events")
    template = models.ForeignKey(EventTemplate, on_delete=models.SET_NULL, null=True, blank=True, related_name="events")
    title = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=EVENT_TYPES, default="other")
    status = models.CharField(max_length=20, choices=[(value, value.title()) for value in ["draft", "planning", "published", "live", "completed", "archived"]], default="draft")
    location = models.JSONField(default=dict)
    starts_at = models.DateTimeField(null=True, blank=True)
    ends_at = models.DateTimeField(null=True, blank=True)
    timezone = models.CharField(max_length=50, default="Asia/Kathmandu")
    expected_attendees = models.PositiveIntegerField(default=0)
    budget_target_minor = models.BigIntegerField(default=0)
    currency = models.CharField(max_length=3, default="NPR")
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES, default="user")
    revision = models.PositiveIntegerField(default=0)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = str(self.id)[:8]
        if not self._state.adding:
            self.revision += 1
        super().save(*args, **kwargs)


class Milestone(BaseModel):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="milestones")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    due_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=[(value, value.replace("_", " ").title()) for value in ["pending", "in_progress", "done", "at_risk"]], default="pending")
    is_critical_path = models.BooleanField(default=False)
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES, default="user")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "due_at"]


class Task(BaseModel):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="tasks")
    milestone = models.ForeignKey(Milestone, on_delete=models.SET_NULL, null=True, blank=True, related_name="tasks")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    assignee = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    due_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=[(value, value.replace("_", " ").title()) for value in ["todo", "in_progress", "blocked", "done"]], default="todo")
    depends_on = models.ForeignKey("self", on_delete=models.SET_NULL, null=True, blank=True)
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES, default="user")


class BudgetLineItem(BaseModel):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="budget_items")
    category = models.CharField(max_length=30, choices=BUDGET_CATEGORIES)
    label = models.CharField(max_length=255, blank=True)
    planned_minor = models.BigIntegerField(default=0)
    committed_minor = models.BigIntegerField(default=0)
    actual_minor = models.BigIntegerField(default=0)
    currency = models.CharField(max_length=3, default="NPR")
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES, default="user")
    notes = models.TextField(blank=True)


class Risk(BaseModel):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="risks")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    likelihood = models.CharField(max_length=10, choices=[(value, value.title()) for value in ["low", "medium", "high"]], default="low")
    impact = models.CharField(max_length=10, choices=[(value, value.title()) for value in ["low", "medium", "high"]], default="low")
    mitigation = models.TextField(blank=True)
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES, default="user")
    status = models.CharField(max_length=20, choices=[(value, value.title()) for value in ["open", "mitigated", "accepted", "closed"]], default="open")


class SeatingPlan(BaseModel):
    event = models.OneToOneField(Event, on_delete=models.CASCADE, related_name="seating_plan")
    layout = models.JSONField(default=dict)
    assignments = models.JSONField(default=dict)


class EventComment(BaseModel):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    body = models.TextField()
