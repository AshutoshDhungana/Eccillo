from rest_framework import serializers

from .models import AgentRun, AgentRunStep, AgentSession, AgentTurn


class AgentSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentSession
        fields = ["id", "event", "organization", "user", "pending_approvals", "created_at"]
        read_only_fields = fields


class AgentTurnSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentTurn
        fields = ["id", "role", "content", "run", "created_at"]
        read_only_fields = fields


class AgentRunStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentRunStep
        fields = ["step_id", "skill", "outcome", "data", "explanation", "error", "order"]
        read_only_fields = fields


class AgentRunSerializer(serializers.ModelSerializer):
    steps = AgentRunStepSerializer(many=True, read_only=True)

    class Meta:
        model = AgentRun
        fields = [
            "id", "session", "event", "status", "user_text", "intent", "ai_state", "message",
            "clarifying", "missing_fields", "plan", "explanation", "pending_approvals",
            "observability", "error", "steps", "created_at", "started_at", "finished_at",
        ]
        read_only_fields = fields
