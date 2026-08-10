"""Orchestration persistence models.

Milestone 2 adds the hybrid state-store sidecar; sessions/runs arrive in M4.
"""

from django.db import models

from common.models import BaseModel


class AgentEventState(BaseModel):
    """Sidecar holding the agent-only fields of a StructuredEvent.

    Canonical fields (title, dates, budget, timeline, tasks, budget lines, risks)
    live in the real ``planning`` tables — this row carries only what has no home
    there, plus the fine-grained AI workflow status and a cached snapshot for
    fast reads / auditing.  One-to-one with ``planning.Event``.
    """

    event = models.OneToOneField("planning.Event", on_delete=models.CASCADE, related_name="agent_state")

    # Fine-grained agent workflow state (agent.state.EventState value). This is
    # richer than Event.status, which several EventStates collapse onto.
    ai_status = models.CharField(max_length=40, blank=True)

    # Agent-only collections with no canonical table.
    requirements = models.JSONField(default=list)
    vendors = models.JSONField(default=list)   # list[VendorRef]
    guests = models.JSONField(default=list)    # list[GuestSegment]
    notes = models.JSONField(default=list)
    # Per-milestone agent metadata keyed by title: {offset_days, critical_path}.
    timeline_meta = models.JSONField(default=dict)

    # Denormalized full StructuredEvent snapshot (source of truth stays the ORM;
    # this is a convenience cache, refreshed on every save()).
    snapshot = models.JSONField(default=dict)

    organizer_id = models.UUIDField(null=True, blank=True)

    def __str__(self):
        return f"AgentEventState<{self.event_id}> {self.ai_status}"


class AgentMemory(BaseModel):
    """Backs ``agent.memory.KeyValueMemoryStore`` (org + user memory tiers).

    ``scope`` is the agent-supplied namespace, e.g. ``"org:<uuid>"`` or
    ``"user:<uuid>"``; ``data`` is the free-form preference bag for that scope.
    """

    scope = models.CharField(max_length=200, unique=True)
    data = models.JSONField(default=dict)

    def __str__(self):
        return f"AgentMemory<{self.scope}>"


class AgentSession(BaseModel):
    """One conversation thread bound to an event (and its org/organizer)."""

    event = models.ForeignKey("planning.Event", on_delete=models.CASCADE, related_name="agent_sessions")
    organization = models.ForeignKey("accounts.Organization", on_delete=models.CASCADE)
    user = models.ForeignKey("accounts.User", on_delete=models.SET_NULL, null=True, blank=True)
    # Approval gates surfaced by the last turn, restored before an "approve" turn.
    pending_approvals = models.JSONField(default=list)

    class Meta:
        indexes = [models.Index(fields=["event", "created_at"])]


class AgentTurn(BaseModel):
    """A single persisted conversation message (user or assistant)."""

    session = models.ForeignKey(AgentSession, on_delete=models.CASCADE, related_name="turns")
    role = models.CharField(max_length=12, choices=[("user", "User"), ("assistant", "Assistant")])
    content = models.TextField()
    run = models.ForeignKey("orchestration.AgentRun", on_delete=models.SET_NULL, null=True, blank=True, related_name="turns")

    class Meta:
        ordering = ["created_at"]


class AgentRun(BaseModel):
    """Durable record of one background turn execution (the 'run graph' root)."""

    STATUS = [(v, v.title()) for v in ["queued", "running", "completed", "failed"]]

    session = models.ForeignKey(AgentSession, on_delete=models.CASCADE, related_name="runs")
    event = models.ForeignKey("planning.Event", on_delete=models.CASCADE, related_name="agent_runs")
    user_text = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS, default="queued")
    intent = models.CharField(max_length=40, blank=True)
    ai_state = models.CharField(max_length=40, blank=True)
    message = models.TextField(blank=True)
    clarifying = models.BooleanField(default=False)
    missing_fields = models.JSONField(default=list)
    plan = models.JSONField(default=dict)
    explanation = models.JSONField(default=list)
    pending_approvals = models.JSONField(default=list)
    observability = models.JSONField(default=dict)
    error = models.TextField(blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    finished_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [models.Index(fields=["session", "created_at"]), models.Index(fields=["status"])]


class AgentRunStep(BaseModel):
    """One skill execution within a run (ordered specialist steps)."""

    run = models.ForeignKey(AgentRun, on_delete=models.CASCADE, related_name="steps")
    step_id = models.CharField(max_length=60)
    skill = models.CharField(max_length=60)
    outcome = models.CharField(max_length=30)
    data = models.JSONField(default=dict)
    explanation = models.JSONField(default=list)
    error = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]
