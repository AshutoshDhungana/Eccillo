import uuid
from django.db import models


class BaseModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class SoftDeleteModel(BaseModel):
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        abstract = True


class DomainEvent(BaseModel):
    """Durable transactional outbox record.

    Producers create this row in the same transaction as the domain write.  A
    separate dispatcher leases the row and only marks it delivered after every
    registered consumer has completed successfully.  The status fields are
    deliberately part of the record, rather than Celery state, so retries and
    dead-letter recovery remain visible and recoverable from PostgreSQL.
    """

    DELIVERY_STATUS_CHOICES = [
        ("pending", "Pending"),
        ("delivering", "Delivering"),
        ("failed", "Failed"),
        ("delivered", "Delivered"),
        ("dead_letter", "Dead letter"),
    ]

    type = models.CharField(max_length=120)
    organization = models.ForeignKey("accounts.Organization", on_delete=models.CASCADE, related_name="domain_events")
    event = models.ForeignKey("planning.Event", on_delete=models.CASCADE, null=True, blank=True, related_name="domain_events")
    actor = models.ForeignKey("accounts.User", on_delete=models.SET_NULL, null=True, blank=True)
    payload = models.JSONField(default=dict)
    schema_version = models.PositiveSmallIntegerField(default=1)
    # A producer-provided key makes at-least-once publication safe.  It is
    # intentionally nullable: events without a stable business key are valid
    # and are treated as distinct facts.
    dedupe_key = models.CharField(max_length=255, null=True, blank=True)
    delivery_status = models.CharField(
        max_length=20,
        choices=DELIVERY_STATUS_CHOICES,
        default="pending",
    )
    attempts = models.PositiveIntegerField(default=0)
    next_attempt_at = models.DateTimeField(null=True, blank=True)
    last_attempt_at = models.DateTimeField(null=True, blank=True)
    lease_owner = models.CharField(max_length=160, blank=True)
    lease_expires_at = models.DateTimeField(null=True, blank=True)
    last_error = models.TextField(blank=True)
    # Kept for compatibility with the original outbox schema.  It now records
    # the successful hand-off timestamp, never the producer-side creation time.
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["organization", "created_at"]),
            models.Index(fields=["event", "type"]),
            models.Index(fields=["delivery_status", "next_attempt_at", "created_at"]),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=["organization", "dedupe_key"],
                condition=models.Q(dedupe_key__isnull=False),
                name="unique_domain_event_dedupe_key",
            ),
        ]


class IdempotencyRecord(BaseModel):
    organization = models.ForeignKey("accounts.Organization", on_delete=models.CASCADE)
    key = models.CharField(max_length=255)
    method = models.CharField(max_length=12)
    path = models.CharField(max_length=500)
    request_hash = models.CharField(max_length=64)
    status_code = models.PositiveSmallIntegerField()
    response_body = models.JSONField(default=dict)

    class Meta:
        constraints = [models.UniqueConstraint(fields=["organization", "key", "method", "path"], name="unique_idempotency_request")]


class ApprovalChain(BaseModel):
    organization = models.ForeignKey("accounts.Organization", on_delete=models.CASCADE)
    resource_type = models.CharField(max_length=80)
    resource_id = models.UUIDField()
    status = models.CharField(max_length=20, choices=[("pending", "Pending"), ("approved", "Approved"), ("rejected", "Rejected"), ("cancelled", "Cancelled")], default="pending")

    class Meta:
        indexes = [models.Index(fields=["resource_type", "resource_id"])]


class ApprovalStep(BaseModel):
    chain = models.ForeignKey(ApprovalChain, on_delete=models.CASCADE, related_name="steps")
    approver = models.ForeignKey("accounts.Membership", on_delete=models.CASCADE)
    sequence = models.PositiveIntegerField()
    decision = models.CharField(max_length=20, choices=[("pending", "Pending"), ("approved", "Approved"), ("rejected", "Rejected")], default="pending")
    decided_at = models.DateTimeField(null=True, blank=True)
    comment = models.TextField(blank=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=["chain", "sequence"], name="unique_approval_sequence")]


class Notification(BaseModel):
    recipient = models.ForeignKey("accounts.User", on_delete=models.CASCADE, related_name="notifications")
    organization = models.ForeignKey("accounts.Organization", on_delete=models.CASCADE)
    event = models.ForeignKey("planning.Event", on_delete=models.CASCADE, null=True, blank=True)
    channel = models.CharField(max_length=20, choices=[("email", "Email"), ("sms", "SMS"), ("push", "Push"), ("in_app", "In app")], default="in_app")
    template_key = models.CharField(max_length=100, blank=True)
    payload = models.JSONField(default=dict)
    status = models.CharField(max_length=20, choices=[("queued", "Queued"), ("sent", "Sent"), ("delivered", "Delivered"), ("failed", "Failed")], default="queued")
