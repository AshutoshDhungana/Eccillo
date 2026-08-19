"""Procurement — turn a selected shortlist into outreach, and outreach into leads.

Two models, on purpose:

* :class:`ProcurementRequest` is what the organizer is asking for (one category,
  one scope, one budget ceiling, one deadline).
* :class:`Outreach` is one counterparty's row in that request: who we mailed,
  the token they answer on, and — merged into the same row — the quote they
  came back with.  A separate ``Proposal`` table would be one-to-one with this
  and buy nothing; a revised quote simply overwrites, which is what a vendor
  expects from an "update your quote" link anyway.

The counterparty is a real FK to ``marketplace.Vendor`` because that is the only
party model that exists.  ``party_type`` is carried alongside it so a future
Talent/Sponsor lands as one nullable FK plus a discriminator value, rather than
a rewrite — but nothing is abstracted away before there is a second case.

``party_name`` and ``to_email`` are *snapshotted* at creation: an outreach record
has to keep saying what we actually sent and where we sent it, even if the
vendor row is later edited or re-discovered from OpenStreetMap.
"""

from django.db import models

from common.models import BaseModel
from marketplace.models import VENDOR_CATEGORIES

PARTY_TYPES = [("vendor", "Vendor"), ("talent", "Talent"), ("sponsor", "Sponsor")]


class ProcurementRequest(BaseModel):
    REQUEST_STATUS = [(v, v.title()) for v in ["draft", "sent", "closed", "cancelled"]]

    # Denormalized alongside ``event`` for the same reason common.DomainEvent
    # carries both: the public reply endpoint has no request.organization.
    organization = models.ForeignKey(
        "accounts.Organization", on_delete=models.CASCADE, related_name="procurement_requests"
    )
    event = models.ForeignKey("planning.Event", on_delete=models.CASCADE, related_name="procurement_requests")
    category = models.CharField(max_length=30, choices=VENDOR_CATEGORIES)
    title = models.CharField(max_length=255)
    scope = models.TextField(blank=True)
    requirements = models.JSONField(default=list)
    budget_ceiling_minor = models.BigIntegerField(default=0)
    # Naming a ceiling anchors every quote to it, so it is opt-in per request.
    share_budget = models.BooleanField(default=False)
    currency = models.CharField(max_length=3, default="NPR")
    respond_by = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=REQUEST_STATUS, default="draft")
    created_by = models.ForeignKey("accounts.User", on_delete=models.SET_NULL, null=True, blank=True)
    source = models.CharField(max_length=20, choices=[("user", "User"), ("ai", "AI")], default="user")
    sent_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["event", "status"])]

    def __str__(self):
        return f"{self.title} ({self.category}/{self.status})"

    @property
    def is_open(self) -> bool:
        """Whether a counterparty may still submit a quote against this request."""
        from django.utils import timezone

        if self.status != "sent":
            return False
        return self.respond_by is None or self.respond_by > timezone.now()


class Outreach(BaseModel):
    """One counterparty on one request: the send record and the quote it earned."""

    # pending    — created, not yet confirmed for sending
    # queued     — organizer confirmed the batch; waiting on the sender
    # sending    — claimed by a sender (compare-and-swap; prevents a double send)
    # sent       — handed to SMTP
    # responded  — counterparty submitted a quote
    # declined   — counterparty answered "we can't serve this"
    # no_channel — nothing to send to (vendor has no email on file)
    # failed     — SMTP rejected it; last_error says why
    OUTREACH_STATUS = [
        (v, v.replace("_", " ").title())
        for v in ["pending", "queued", "sending", "sent", "responded", "declined", "no_channel", "failed"]
    ]

    request = models.ForeignKey(ProcurementRequest, on_delete=models.CASCADE, related_name="outreach")
    party_type = models.CharField(max_length=20, choices=PARTY_TYPES, default="vendor")
    # PROTECT: you should not be able to delete a vendor you hold a live quote from.
    vendor = models.ForeignKey("marketplace.Vendor", on_delete=models.PROTECT, related_name="outreach")
    # Snapshotted at creation — see the module docstring.
    party_name = models.CharField(max_length=255)
    to_email = models.EmailField(blank=True)

    # unique=True already indexes this; a second db_index would be redundant.
    token = models.CharField(max_length=64, unique=True)
    status = models.CharField(max_length=20, choices=OUTREACH_STATUS, default="pending")
    sent_at = models.DateTimeField(null=True, blank=True)
    responded_at = models.DateTimeField(null=True, blank=True)
    attempts = models.PositiveIntegerField(default=0)
    last_error = models.TextField(blank=True)

    # --- the lead, once they answer -------------------------------------
    # "Can they serve this at all" is already carried by status responded/declined,
    # so only the answers that status cannot express are stored.
    quote_minor = models.BigIntegerField(null=True, blank=True)
    available = models.BooleanField(null=True, blank=True)
    notes = models.TextField(blank=True)
    reply_contact_name = models.CharField(max_length=120, blank=True)
    reply_contact_email = models.EmailField(blank=True)

    class Meta:
        ordering = ["party_name"]
        constraints = [
            models.UniqueConstraint(fields=["request", "vendor"], name="unique_outreach_vendor_per_request")
        ]
        indexes = [models.Index(fields=["request", "status"])]

    def __str__(self):
        return f"{self.party_name} → {self.request_id} ({self.status})"
