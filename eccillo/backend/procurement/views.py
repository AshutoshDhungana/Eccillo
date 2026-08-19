"""Procurement API.

Organizer endpoints are event-scoped and reuse the platform's auth + org
isolation.  The counterparty endpoint is deliberately the opposite: no account,
no token header, just an unguessable URL — because asking a caterer to sign up
before quoting is how you get no quotes.
"""

from django.utils.dateparse import parse_datetime
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle

from common.permissions import accessible_event
from marketplace.models import Vendor

from . import services
from .models import Outreach, ProcurementRequest

DENIED = Response({"detail": "Event access denied."}, status=status.HTTP_403_FORBIDDEN)


def _outreach_dict(o: Outreach, currency: str) -> dict:
    return {
        "id": str(o.id),
        "party_type": o.party_type,
        "vendor_id": str(o.vendor_id),
        "party_name": o.party_name,
        "to_email": o.to_email,
        "status": o.status,
        "sent_at": o.sent_at.isoformat() if o.sent_at else None,
        "responded_at": o.responded_at.isoformat() if o.responded_at else None,
        "quote_minor": o.quote_minor,
        "available": o.available,
        "notes": o.notes,
        "reply_contact_name": o.reply_contact_name,
        "reply_contact_email": o.reply_contact_email,
        "currency": currency,
        "last_error": o.last_error,
    }


def _request_dict(req: ProcurementRequest, *, detail: bool = False) -> dict:
    rows = list(req.outreach.all())
    counts: dict[str, int] = {}
    for row in rows:
        counts[row.status] = counts.get(row.status, 0) + 1
    data = {
        "id": str(req.id),
        "event_id": str(req.event_id),
        "category": req.category,
        "title": req.title,
        "scope": req.scope,
        "requirements": req.requirements,
        "budget_ceiling_minor": req.budget_ceiling_minor,
        "share_budget": req.share_budget,
        "currency": req.currency,
        "respond_by": req.respond_by.isoformat() if req.respond_by else None,
        "status": req.status,
        "is_open": req.is_open,
        "sent_at": req.sent_at.isoformat() if req.sent_at else None,
        "created_at": req.created_at.isoformat(),
        "counts": counts,
        "total": len(rows),
    }
    if detail:
        # Leads first, cheapest first — this is the comparison view.
        leads = [r for r in rows if r.status == "responded"]
        rest = [r for r in rows if r.status != "responded"]
        leads.sort(key=lambda r: (r.quote_minor is None, r.quote_minor or 0))
        data["outreach"] = [_outreach_dict(r, req.currency) for r in leads + rest]
    return data


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def procurement_requests(request, event_id):
    """List this event's procurement requests, or draft a new one from a selection."""
    event = accessible_event(request, event_id, write=request.method == "POST")
    if event is None:
        return DENIED

    if request.method == "GET":
        qs = ProcurementRequest.objects.filter(event=event).prefetch_related("outreach")
        return Response({"requests": [_request_dict(r) for r in qs]})

    # Fall back to the event's saved shortlist, which until now nothing read back.
    vendor_ids = request.data.get("vendor_ids") or [
        str(vid) for vid in event.vendor_shortlists.values_list("vendor_id", flat=True)
    ]
    category = (request.data.get("category") or "").strip()
    if not vendor_ids:
        return Response(
            {"detail": "vendor_ids is required (and this event has no saved shortlist)."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    if not category:
        return Response({"detail": "category is required."}, status=status.HTTP_400_BAD_REQUEST)

    respond_by = request.data.get("respond_by")
    try:
        req = services.create_request(
            event=event,
            organization=request.organization,
            actor=request.user,
            category=category,
            vendor_ids=[str(v) for v in vendor_ids],
            title=(request.data.get("title") or "").strip(),
            scope=(request.data.get("scope") or "").strip(),
            requirements=request.data.get("requirements") or [],
            budget_ceiling_minor=int(request.data.get("budget_ceiling_minor") or 0),
            share_budget=bool(request.data.get("share_budget")),
            respond_by=parse_datetime(respond_by) if respond_by else None,
            idempotency_key=request.headers.get("Idempotency-Key"),
        )
    except (ValueError, TypeError) as exc:
        return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    # The organizer reviews this exact text before anything is sent.
    first = req.outreach.filter(status="pending").first()
    preview = services.draft_outreach(req, first) if first else {}
    body = _request_dict(req, detail=True)
    body["preview"] = {"subject": preview.get("subject", ""), "body": preview.get("body", "")}
    return Response(body, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def procurement_request_detail(request, event_id, request_id):
    event = accessible_event(request, event_id)
    if event is None:
        return DENIED
    req = ProcurementRequest.objects.filter(event=event, id=request_id).prefetch_related("outreach").first()
    if req is None:
        return Response({"detail": "Request not found."}, status=status.HTTP_404_NOT_FOUND)
    return Response(_request_dict(req, detail=True))


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def procurement_request_send(request, event_id, request_id):
    """The one confirmation gate. Everything after this is automatic."""
    event = accessible_event(request, event_id, write=True)
    if event is None:
        return DENIED
    req = ProcurementRequest.objects.filter(event=event, id=request_id).select_related("event").first()
    if req is None:
        return Response({"detail": "Request not found."}, status=status.HTTP_404_NOT_FOUND)
    try:
        services.send_request(request=req, organization=request.organization, actor=request.user)
    except ValueError as exc:
        return Response({"detail": str(exc)}, status=status.HTTP_409_CONFLICT)
    req.refresh_from_db()
    return Response(_request_dict(req, detail=True))


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def procurement_leads(request, event_id):
    """Every quote received for this event, cheapest first — the leads inbox."""
    event = accessible_event(request, event_id)
    if event is None:
        return DENIED
    rows = (
        Outreach.objects.filter(request__event=event, status="responded")
        .select_related("request", "vendor")
        .order_by("quote_minor")
    )
    leads = []
    for row in rows:
        lead = _outreach_dict(row, row.request.currency)
        lead["request"] = {"id": str(row.request_id), "title": row.request.title, "category": row.request.category}
        lead["vendor"] = {
            "rating_avg": float(row.vendor.rating_avg),
            "review_count": row.vendor.review_count,
            "website": row.vendor.website,
            "contact_phone": row.vendor.contact_phone,
        }
        leads.append(lead)
    return Response({"leads": leads})


# --------------------------------------------------------------------------
# Public counterparty endpoint — unauthenticated, token-addressed
# --------------------------------------------------------------------------
@api_view(["GET", "POST"])
@permission_classes([AllowAny])
# ponytail: LocMemCache is per-process, so this throttles one gunicorn worker,
# not the deployment. Point CACHES at the Redis that already runs if it matters.
@throttle_classes([AnonRateThrottle])
def outreach_respond(request, token):
    """Show a counterparty what is being asked, and take their quote.

    Only ever discloses what we already emailed them — never the other invited
    vendors, their quotes, or the organizer's budget ceiling, which would anchor
    every quote to it.
    """
    outreach = (
        Outreach.objects.select_related("request", "request__event", "request__organization")
        .filter(token=token)
        .first()
    )
    if outreach is None or outreach.status == "no_channel":
        return Response({"detail": "This link is not valid."}, status=status.HTTP_404_NOT_FOUND)

    req = outreach.request
    event = req.event
    location = event.location or {}
    public = {
        "party_name": outreach.party_name,
        "organization": req.organization.name,
        "event_title": event.title,
        "event_date": event.starts_at.date().isoformat() if event.starts_at else None,
        "location": location.get("venue") or location.get("location") or "",
        "guests": event.expected_attendees or 0,
        "category": req.category,
        "title": req.title,
        "scope": req.scope,
        "requirements": req.requirements,
        "currency": req.currency,
        "respond_by": req.respond_by.isoformat() if req.respond_by else None,
        "is_open": req.is_open,
        "already_responded": outreach.status in {"responded", "declined"},
        "submitted": {
            "can_serve": outreach.status == "responded",
            "quote_minor": outreach.quote_minor,
            "available": outreach.available,
            "notes": outreach.notes,
        }
        if outreach.status in {"responded", "declined"}
        else None,
    }
    # Only shown when the organizer chose to name it.
    if req.share_budget:
        public["budget_ceiling_minor"] = req.budget_ceiling_minor

    if request.method == "GET":
        return Response(public)

    try:
        services.record_response(outreach=outreach, data=request.data or {})
    except services.ClosedRequest as exc:
        return Response({"detail": str(exc)}, status=status.HTTP_410_GONE)
    except ValueError as exc:
        return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
    return Response({"status": "received", "party_name": outreach.party_name})
