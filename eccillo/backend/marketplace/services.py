"""Marketplace-domain writes, run inside the event mutation boundary."""

from __future__ import annotations

from uuid import UUID

from django.db.models import Avg

from common.event_mutations import execute_event_mutation

from .models import EventVendorShortlist, Review, Vendor


def create_event_vendor_review(*, event, vendor, organization, actor, values, idempotency_key=None):
    """Record a completed-contract review inside the event mutation boundary."""

    data = {key: value for key, value in dict(values).items() if key not in {"event", "vendor", "author"}}

    def mutation(locked_event):
        locked_vendor = Vendor.objects.select_for_update().get(pk=vendor.pk)
        review = Review.objects.create(event=locked_event, vendor=locked_vendor, author=actor, **data)
        aggregate = locked_vendor.reviews.aggregate(rating_avg=Avg("rating"))
        locked_vendor.review_count = locked_vendor.reviews.count()
        locked_vendor.rating_avg = aggregate["rating_avg"] or 0
        locked_vendor.save(update_fields=["rating_avg", "review_count", "updated_at"])
        return {"review_id": str(review.id), "vendor_id": str(locked_vendor.id)}

    outcome = execute_event_mutation(
        event=event,
        organization=organization,
        actor=actor,
        event_type="marketplace.review.created",
        mutation=mutation,
        payload={"resource": "vendor_review", "vendor_id": str(vendor.id)},
        idempotency_payload=data,
        idempotency_key=idempotency_key,
    )
    return Review.objects.get(id=outcome.result["review_id"])


def save_vendor_shortlist(*, event, vendor_ids, notes="", source="ai_suggested", action_id=None):
    """Persist an internal shortlist without contacting any vendor.

    Deduplicates vendor ids, validates existence, and upserts one row per vendor.
    Used by the agent's vendor skill (via the orchestration adapter) and the API.
    """

    raw_vendor_ids = vendor_ids or []
    if not raw_vendor_ids:
        raise ValueError("At least one vendor is required for a shortlist.")
    ids = list(dict.fromkeys(str(v) for v in raw_vendor_ids))
    try:
        [UUID(v) for v in ids]
    except (TypeError, ValueError, AttributeError) as exc:
        raise ValueError("Shortlist vendor_ids must contain valid vendor identifiers.") from exc

    vendors_by_id = {str(v.id): v for v in Vendor.objects.filter(id__in=ids)}
    missing = [v for v in ids if v not in vendors_by_id]
    if missing:
        raise ValueError("One or more requested vendors do not exist.")

    created = []
    for vendor_id in ids:
        shortlist, _ = EventVendorShortlist.objects.update_or_create(
            event=event,
            vendor=vendors_by_id[vendor_id],
            defaults={"notes": str(notes or ""), "source": source, "copilot_action_id": action_id},
        )
        created.append(str(shortlist.id))
    return {"shortlist_ids": created, "vendor_ids": ids, "count": len(created)}
