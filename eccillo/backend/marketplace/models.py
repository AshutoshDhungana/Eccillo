"""Vendor marketplace — clean data-layer restore (Phase 3, Milestone 1).

Restored from the pre-revert build, decoupled from the deleted `documents`,
`copilot`, and `procurement` apps:

* ``PortfolioItem.document`` (FK to ``documents.Document``) → plain ``image_url``.
* ``EventVendorShortlist.copilot_action_id`` is kept as a generic nullable UUID
  (no FK / no import) so an AI-originated shortlist can still be traced.

The explainable vendor scoring lives in ``common/matching.py`` and reads
``Vendor`` / ``AvailabilityHold`` directly.
"""

from django.db import models

from common.models import BaseModel

VENDOR_CATEGORIES = [
    (v, v.replace("_", " ").title())
    for v in [
        "venue", "catering", "photography", "videography", "printing", "merchandise",
        "security", "decoration", "booth", "av", "internet", "transport", "hotel",
        "insurance", "cleaning",
    ]
]


class Vendor(BaseModel):
    organization = models.OneToOneField(
        "accounts.Organization", on_delete=models.CASCADE, null=True, blank=True, related_name="vendor_profile"
    )
    display_name = models.CharField(max_length=255)
    legal_name = models.CharField(max_length=255, blank=True)
    category = models.CharField(max_length=30, choices=VENDOR_CATEGORIES)
    description = models.TextField(blank=True)
    service_areas = models.JSONField(default=list)
    certifications = models.JSONField(default=list)
    rating_avg = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    review_count = models.PositiveIntegerField(default=0)
    response_time_mins = models.PositiveIntegerField(default=0)
    price_from_minor = models.BigIntegerField(default=0)
    price_to_minor = models.BigIntegerField(default=0)
    currency = models.CharField(max_length=3, default="NPR")
    verification_status = models.CharField(
        max_length=20,
        choices=[(v, v.title()) for v in ["unverified", "pending", "verified", "rejected"]],
        default="unverified",
    )
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    website = models.URLField(blank=True)
    portfolio_images = models.JSONField(default=list)

    # Provenance for discovered (non-seeded) vendors, e.g. OpenStreetMap POIs.
    external_source = models.CharField(max_length=20, blank=True)  # "osm" | "google" | "manual"
    external_ref = models.CharField(max_length=120, blank=True, db_index=True)  # e.g. "node/123456"
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    class Meta:
        indexes = [models.Index(fields=["category", "verification_status"])]

    def __str__(self):
        return self.display_name


class ServiceListing(BaseModel):
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name="listings")
    category = models.CharField(max_length=30, choices=VENDOR_CATEGORIES)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    pricing_model = models.CharField(
        max_length=20,
        choices=[(v, v.replace("_", " ").title()) for v in ["flat", "per_person", "per_hour", "per_day", "custom"]],
        default="flat",
    )
    price_from_minor = models.BigIntegerField(default=0)
    currency = models.CharField(max_length=3, default="NPR")
    capacity_min = models.PositiveIntegerField(null=True, blank=True)
    capacity_max = models.PositiveIntegerField(null=True, blank=True)


class PortfolioItem(BaseModel):
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name="portfolio")
    # Was FK to documents.Document (deleted app) — decoupled to a plain URL.
    image_url = models.URLField(blank=True)
    event_type = models.CharField(max_length=30, blank=True)
    caption = models.TextField(blank=True)


class AvailabilityHold(BaseModel):
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name="availability_holds")
    listing = models.ForeignKey(ServiceListing, on_delete=models.CASCADE, null=True, blank=True)
    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField()
    status = models.CharField(
        max_length=20,
        choices=[(v, v.title()) for v in ["tentative", "confirmed", "released"]],
        default="tentative",
    )
    linked_ref_type = models.CharField(max_length=80, blank=True)
    linked_ref_id = models.UUIDField(null=True, blank=True)


class EventVendorShortlist(BaseModel):
    """An internal, organizer-owned vendor shortlist for one event.

    Distinct from an availability hold or an RFP invitation: saving it is an
    internal workspace mutation; contacting a vendor remains an external,
    approval-chain action.
    """

    event = models.ForeignKey("planning.Event", on_delete=models.CASCADE, related_name="vendor_shortlists")
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name="event_shortlists")
    notes = models.TextField(blank=True)
    source = models.CharField(
        max_length=20,
        choices=[("user", "User"), ("ai_suggested", "AI suggested")],
        default="user",
    )
    # Generic trace of the AI action that created this (no FK to a copilot app).
    copilot_action_id = models.UUIDField(null=True, blank=True, db_index=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=["event", "vendor"], name="unique_event_vendor_shortlist")]
        indexes = [models.Index(fields=["event", "created_at"])]


class Review(BaseModel):
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name="reviews")
    event = models.ForeignKey(
        "planning.Event", on_delete=models.CASCADE, related_name="vendor_reviews", null=True, blank=True
    )
    author = models.ForeignKey("accounts.User", on_delete=models.CASCADE, null=True, blank=True)
    rating = models.PositiveSmallIntegerField()
    body = models.TextField(blank=True)
    verified_booking = models.BooleanField(default=True)


class VendorDiscoveryLog(BaseModel):
    """Cache/audit of a location+category discovery sweep (rate-limit friendly).

    A fresh log entry within the TTL means we skip re-hitting the external
    provider and serve the already-persisted vendors instead.
    """

    location = models.CharField(max_length=200)
    category = models.CharField(max_length=30)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    radius_m = models.PositiveIntegerField(default=15000)
    provider = models.CharField(max_length=20, default="osm")
    found = models.PositiveIntegerField(default=0)
    created_count = models.PositiveIntegerField(default=0)

    class Meta:
        indexes = [models.Index(fields=["location", "category", "created_at"])]
