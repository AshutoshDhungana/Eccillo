from rest_framework import serializers

from .models import BudgetLineItem, Event, EventComment, EventTemplate, Milestone, Risk, SeatingPlan, Task


class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = ["id", "title", "description", "due_at", "status", "is_critical_path", "source", "order", "created_at"]
        read_only_fields = ["id", "source", "created_at"]


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ["id", "milestone", "title", "description", "assignee", "due_at", "status", "depends_on", "source", "created_at"]
        read_only_fields = ["id", "source", "created_at"]


class BudgetLineItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetLineItem
        fields = ["id", "category", "label", "planned_minor", "committed_minor", "actual_minor", "currency", "source", "notes"]
        read_only_fields = ["id", "source"]


class RiskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Risk
        fields = ["id", "title", "description", "likelihood", "impact", "mitigation", "source", "status", "created_at"]
        read_only_fields = ["id", "source", "created_at"]


class SeatingPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SeatingPlan
        fields = ["id", "layout", "assignments", "updated_at"]
        read_only_fields = ["id", "updated_at"]


class EventCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventComment
        fields = ["id", "body", "created_at"]
        read_only_fields = ["id", "created_at"]


class EventTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventTemplate
        fields = ["id", "name", "type", "blueprint", "is_public"]


class EventSerializer(serializers.ModelSerializer):
    milestones = MilestoneSerializer(many=True, read_only=True)
    tasks = TaskSerializer(many=True, read_only=True)
    budget_items = BudgetLineItemSerializer(many=True, read_only=True)
    risks = RiskSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = ["id", "title", "type", "status", "location", "starts_at", "ends_at", "timezone", "expected_attendees", "budget_target_minor", "currency", "source", "revision", "slug", "description", "template", "milestones", "tasks", "budget_items", "risks", "created_at", "updated_at"]
        read_only_fields = ["id", "slug", "revision", "source", "created_at", "updated_at"]


class EventListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ["id", "title", "type", "status", "starts_at", "ends_at", "expected_attendees", "revision", "slug", "created_at"]
