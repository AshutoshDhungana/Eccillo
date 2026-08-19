"""Procurement domain writes and the outreach sender.

Deliberately free of Celery imports: ``procurement/tasks.py`` is a thin wrapper
so the whole flow stays runnable — and testable — without a broker installed.

Every organizer-facing write goes through ``common.event_mutations`` so it gets
the same event lock, revision bump, idempotency replay, and durable outbox fact
as any other event-owned mutation.
"""

from __future__ import annotations

import logging
import secrets
from typing import Any

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.mail import get_connection, send_mail
from django.core.validators import validate_email
from django.db import transaction
from django.utils import timezone

from common.event_mutations import execute_event_mutation
from marketplace.models import Vendor

from .models import Outreach, ProcurementRequest

logger = logging.getLogger(__name__)

# A quote past this is a typo or an attack, not an offer. Minor units, so this is
# 10 billion major units — far beyond any real event, and far under a bigint.
MAX_QUOTE_MINOR = 10**12
MAX_NOTES_CHARS = 2000


class ClosedRequest(ValueError):
    """The counterparty answered after the door shut."""


# --------------------------------------------------------------------------
# Drafting
# --------------------------------------------------------------------------
def draft_outreach(request: ProcurementRequest, outreach: Outreach) -> dict[str, str]:
    """Render the message one counterparty receives.

    Deterministic and grounded in the event row — no LLM call.  Together with
    the fact that a request is immutable between create and send (there is no
    update endpoint), that is what makes the preview the organizer approves
    byte-for-byte identical to what goes out, without storing a second copy.
    """
    event = request.event
    location = event.location or {}
    date = event.starts_at.date().isoformat() if event.starts_at else "date to be confirmed"
    where = location.get("venue") or location.get("location") or "location to be confirmed"
    reply_url = f"{settings.PUBLIC_WEB_URL}/respond/{outreach.token}"

    lines = [
        f"Hello {outreach.party_name},",
        "",
        f"We are organising {event.title} and are looking for {request.category} services.",
        "",
        f"  Event     {event.title}" + (f" ({event.type})" if event.type else ""),
        f"  Date      {date}",
        f"  Location  {where}",
    ]
    if event.expected_attendees:
        lines.append(f"  Guests    approx. {event.expected_attendees}")
    if request.share_budget and request.budget_ceiling_minor:
        lines.append(f"  Budget    up to {request.currency} {request.budget_ceiling_minor / 100:,.0f}")
    if request.respond_by:
        lines.append(f"  Reply by  {request.respond_by.date().isoformat()}")

    if request.scope:
        lines += ["", request.scope]
    if request.requirements:
        lines += ["", "What we need:"] + [f"  - {r}" for r in request.requirements]

    lines += [
        "",
        "If you can help, send us a quote here — it takes about a minute:",
        reply_url,
        "",
        "You do not need an account, and you will not be added to any mailing list.",
        "",
        "Thank you,",
        request.organization.name,
    ]
    return {
        "subject": f"{request.category.title()} request — {event.title} ({date})",
        "body": "\n".join(lines),
        "reply_url": reply_url,
    }


# --------------------------------------------------------------------------
# Creating a request from a selection
# --------------------------------------------------------------------------
def create_request(
    *,
    event,
    organization,
    actor,
    category: str,
    vendor_ids: list[str],
    title: str = "",
    scope: str = "",
    requirements: list[str] | None = None,
    budget_ceiling_minor: int = 0,
    share_budget: bool = False,
    respond_by=None,
    source: str = "user",
    idempotency_key: str | None = None,
):
    """Create a draft request plus one Outreach row per selected counterparty.

    Nothing is sent here — a draft is a planning record.  Vendors with no email
    on file are still recorded, as ``no_channel``, because the organizer needs
    to see who could *not* be reached rather than have them silently vanish.
    """
    requirements = [str(r)[:500] for r in (requirements or [])]
    vendors = {str(v.id): v for v in Vendor.objects.filter(id__in=vendor_ids)}
    missing = [vid for vid in vendor_ids if str(vid) not in vendors]
    if missing:
        raise ValueError(f"Unknown vendor ids: {', '.join(map(str, missing))}")
    if not vendors:
        raise ValueError("At least one vendor is required.")

    def mutation(locked_event):
        req = ProcurementRequest.objects.create(
            organization=organization,
            event=locked_event,
            category=category,
            title=title or f"{category.title()} for {locked_event.title}",
            scope=scope,
            requirements=requirements,
            budget_ceiling_minor=budget_ceiling_minor,
            share_budget=share_budget,
            currency=locked_event.currency or "NPR",
            respond_by=respond_by,
            created_by=actor,
            source=source,
        )
        # Preserve the caller's order; dedupe without losing it.
        seen: set[str] = set()
        rows = []
        for vid in vendor_ids:
            key = str(vid)
            if key in seen:
                continue
            seen.add(key)
            vendor = vendors[key]
            reachable = bool(vendor.contact_email)
            rows.append(
                Outreach(
                    request=req,
                    party_type="vendor",
                    vendor=vendor,
                    party_name=vendor.display_name,
                    to_email=vendor.contact_email or "",
                    # No recipient means no reply page, so no live token for it.
                    token=secrets.token_urlsafe(32) if reachable else f"unreachable:{secrets.token_urlsafe(16)}",
                    status="pending" if reachable else "no_channel",
                )
            )
        Outreach.objects.bulk_create(rows)
        return {
            "request_id": str(req.id),
            "outreach": len(rows),
            "reachable": sum(1 for r in rows if r.status == "pending"),
        }

    outcome = execute_event_mutation(
        event=event,
        organization=organization,
        actor=actor,
        event_type="procurement.request.created",
        mutation=mutation,
        payload={"resource": "procurement_request", "category": category},
        idempotency_payload={"category": category, "vendor_ids": sorted(map(str, vendor_ids))},
        # DomainEvent.dedupe_key is unique per organization, not per event or
        # type, so every producer has to namespace its own keys.
        idempotency_key=f"procurement.create:{idempotency_key}" if idempotency_key else None,
    )
    return ProcurementRequest.objects.get(id=outcome.result["request_id"])


# --------------------------------------------------------------------------
# Sending — the one gate the organizer confirms
# --------------------------------------------------------------------------
def send_request(*, request: ProcurementRequest, organization, actor) -> dict:
    """Confirm the batch: mark it sent, queue every reachable row, dispatch.

    After this returns, everything downstream (delivery, reply intake, lead
    surfacing) happens without the organizer touching it again.
    """
    if request.status != "draft":
        raise ValueError(f"Request is already {request.status}.")

    def mutation(locked_event):
        queued = Outreach.objects.filter(request=request, status="pending").update(status="queued")
        ProcurementRequest.objects.filter(pk=request.pk).update(status="sent", sent_at=timezone.now())
        return {"request_id": str(request.id), "queued": queued}

    outcome = execute_event_mutation(
        event=request.event,
        organization=organization,
        actor=actor,
        event_type="procurement.outreach.sent",
        mutation=mutation,
        payload={"resource": "procurement_request", "request_id": str(request.id)},
        idempotency_payload={"request_id": str(request.id)},
        # Deterministic, so a double-clicked "Send" replays instead of re-sending.
        idempotency_key=f"procurement.send:{request.id}",
    )
    if not outcome.idempotent_replay:
        transaction.on_commit(lambda: _dispatch_send(str(request.id)))
    return outcome.result


def _dispatch_send(request_id: str) -> None:
    """Hand the batch to a worker, or send inline when there is no broker.

    Celery is optional in this codebase (``config/__init__.py`` tolerates it
    being absent), so the import is what decides — not a failed ``.delay()``,
    which under ``CELERY_TASK_EAGER_PROPAGATES`` would mean the batch already
    ran and re-running it here would be a second pass over the same rows.
    """
    try:
        from .tasks import send_outreach_batch
    except ImportError:  # no Celery installed — this process is the worker
        logger.info("procurement: sending outreach inline (Celery unavailable)")
        send_queued_outreach(request_id)
        return
    send_outreach_batch.delay(request_id)


def send_queued_outreach(request_id: str) -> dict[str, int]:
    """Mail every queued row on a request. Safe to run twice, and concurrently.

    Each row is claimed with a conditional UPDATE before any mail goes out, so
    two senders racing on the same request cannot both mail the same vendor.
    Failures are recorded on the row, never raised: one bad address must not
    abandon the rest of the batch.
    """
    request = ProcurementRequest.objects.select_related("event", "organization").get(pk=request_id)
    sent = failed = 0
    connection = get_connection()
    for outreach in Outreach.objects.filter(request=request, status="queued"):
        # Compare-and-swap: only the sender that flips queued -> sending proceeds.
        if Outreach.objects.filter(pk=outreach.pk, status="queued").update(status="sending") != 1:
            continue
        message = draft_outreach(request, outreach)
        try:
            send_mail(
                subject=message["subject"],
                message=message["body"],
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[outreach.to_email],
                connection=connection,
            )
        except Exception as exc:  # noqa: BLE001 - recorded on the row, not raised
            failed += 1
            logger.warning("procurement: outreach %s failed: %s", outreach.id, exc)
            Outreach.objects.filter(pk=outreach.pk).update(
                status="failed", attempts=outreach.attempts + 1, last_error=f"{type(exc).__name__}: {exc}"
            )
            continue
        sent += 1
        Outreach.objects.filter(pk=outreach.pk).update(
            status="sent", sent_at=timezone.now(), attempts=outreach.attempts + 1, last_error=""
        )
    return {"sent": sent, "failed": failed}


# --------------------------------------------------------------------------
# The reply side — a public, unauthenticated trust boundary
# --------------------------------------------------------------------------
def _clean_quote(raw: Any) -> int | None:
    """Coerce an untrusted quote. Rejects bools, floats, and out-of-range values."""
    if raw in (None, ""):
        return None
    if isinstance(raw, bool) or isinstance(raw, float):
        raise ValueError("quote_minor must be a whole number of minor units.")
    try:
        quote = int(str(raw).strip())
    except (TypeError, ValueError):
        raise ValueError("quote_minor must be a whole number of minor units.") from None
    if not 0 <= quote <= MAX_QUOTE_MINOR:
        raise ValueError("quote_minor is out of range.")
    return quote


def record_response(*, outreach: Outreach, data: dict[str, Any]) -> Outreach:
    """Record a counterparty's quote. Input here is untrusted — validate hard.

    Re-submission is allowed while the request is open: the link doubles as
    "update your quote". ``responded_at`` therefore tracks the latest answer.
    """
    if not outreach.request.is_open:
        raise ClosedRequest("This request is no longer accepting quotes.")
    if outreach.status not in {"sent", "responded", "declined"}:
        raise ValueError("This invitation cannot be answered.")

    can_serve = bool(data.get("can_serve"))
    quote_minor = _clean_quote(data.get("quote_minor"))
    if can_serve and quote_minor is None:
        raise ValueError("A quote is required when you can serve this event.")

    contact_email = str(data.get("contact_email") or "").strip()[:254]
    if contact_email:
        try:
            validate_email(contact_email)
        except ValidationError:
            raise ValueError("contact_email is not a valid address.") from None

    Outreach.objects.filter(pk=outreach.pk).update(
        status="responded" if can_serve else "declined",
        quote_minor=quote_minor if can_serve else None,
        available=bool(data.get("available")) if can_serve else False,
        notes=str(data.get("notes") or "")[:MAX_NOTES_CHARS],
        reply_contact_name=str(data.get("contact_name") or "").strip()[:120],
        reply_contact_email=contact_email,
        responded_at=timezone.now(),
    )
    outreach.refresh_from_db()
    _notify_organizer(outreach)
    return outreach


def _notify_organizer(outreach: Outreach) -> None:
    """Surface the lead in-app. Reuses common.Notification and its existing
    ``GET /api/v1/notifications`` endpoint — no new table, no new route."""
    from accounts.models import Membership
    from common.models import Notification

    request = outreach.request
    recipient = request.created_by
    if recipient is None:
        # Notification.recipient is non-null and created_by is not; an
        # AI-created request must still reach a human.
        owner = (
            Membership.objects.filter(organization=request.organization, role__in=["owner", "admin"])
            .select_related("user")
            .first()
        )
        recipient = owner.user if owner else None
    if recipient is None:
        return
    try:
        Notification.objects.create(
            recipient=recipient,
            organization=request.organization,
            event=request.event,
            channel="in_app",
            template_key="procurement.lead_received",
            payload={
                "request_id": str(request.id),
                "outreach_id": str(outreach.id),
                "party_name": outreach.party_name,
                "quote_minor": outreach.quote_minor,
                "currency": request.currency,
                "status": outreach.status,
            },
        )
    except Exception:  # noqa: BLE001 - a failed notification must never lose a lead
        logger.exception("procurement: failed to notify organizer of lead %s", outreach.id)
