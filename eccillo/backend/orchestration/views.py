"""Conversation API (Phase 3, Milestone 4).

Thin DRF surface over the async agent runtime. A message enqueues a background
run and returns ``202 + run_id``; clients poll the run for the result. All
endpoints are event-scoped and reuse the platform's auth + org isolation.
"""

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from common.permissions import require_event_access
from planning.models import Event

from .models import AgentEventState, AgentRun, AgentSession
from .serializers import AgentRunSerializer, AgentSessionSerializer, AgentTurnSerializer
from .tasks import run_agent_turn


def _event(request, event_id, write=False):
    event = Event.objects.filter(id=event_id).first()
    if event is None or not require_event_access(request, event, "write" if write else "read"):
        return None
    return event


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def agent_sessions(request, event_id):
    event = _event(request, event_id, write=request.method == "POST")
    if event is None:
        return Response({"detail": "Event access denied."}, status=status.HTTP_403_FORBIDDEN)
    if request.method == "GET":
        sessions = AgentSession.objects.filter(event=event).order_by("-created_at")
        return Response(AgentSessionSerializer(sessions, many=True).data)
    session = AgentSession.objects.create(event=event, organization=request.organization, user=request.user)
    return Response(AgentSessionSerializer(session).data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def agent_messages(request, event_id):
    event = _event(request, event_id, write=True)
    if event is None:
        return Response({"detail": "Event access denied."}, status=status.HTTP_403_FORBIDDEN)

    message = (request.data.get("message") or "").strip()
    session_id = request.data.get("session_id")
    if not message:
        return Response({"detail": "message is required."}, status=status.HTTP_400_BAD_REQUEST)

    session = None
    if session_id:
        session = AgentSession.objects.filter(id=session_id, event=event).first()
        if session is None:
            return Response({"detail": "Unknown session for this event."}, status=status.HTTP_404_NOT_FOUND)
    else:
        session = AgentSession.objects.create(event=event, organization=request.organization, user=request.user)

    run = AgentRun.objects.create(session=session, event=event, user_text=message, status="queued")
    run_agent_turn.delay(str(run.id))
    return Response(
        {"run_id": str(run.id), "session_id": str(session.id), "status": run.status},
        status=status.HTTP_202_ACCEPTED,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def agent_run_detail(request, event_id, run_id):
    event = _event(request, event_id)
    if event is None:
        return Response({"detail": "Event access denied."}, status=status.HTTP_403_FORBIDDEN)
    run = AgentRun.objects.filter(id=run_id, event=event).prefetch_related("steps").first()
    if run is None:
        return Response({"detail": "Run not found."}, status=status.HTTP_404_NOT_FOUND)
    return Response(AgentRunSerializer(run).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def agent_transcript(request, event_id, session_id):
    event = _event(request, event_id)
    if event is None:
        return Response({"detail": "Event access denied."}, status=status.HTTP_403_FORBIDDEN)
    session = AgentSession.objects.filter(id=session_id, event=event).first()
    if session is None:
        return Response({"detail": "Session not found."}, status=status.HTTP_404_NOT_FOUND)
    return Response(AgentTurnSerializer(session.turns.all(), many=True).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def agent_approve(request, event_id, session_id):
    """Approve the pending gated actions for a session and execute them.

    Marks the governed ApprovalChain(s) approved (audit) and enqueues an
    ``approve`` turn so the agent runs the previously-gated skills (e.g. sending
    an email) with approval granted.
    """
    event = _event(request, event_id, write=True)
    if event is None:
        return Response({"detail": "Event access denied."}, status=status.HTTP_403_FORBIDDEN)
    session = AgentSession.objects.filter(id=session_id, event=event).first()
    if session is None:
        return Response({"detail": "Session not found."}, status=status.HTTP_404_NOT_FOUND)
    if not session.pending_approvals:
        return Response({"detail": "Nothing is pending approval."}, status=status.HTTP_409_CONFLICT)

    from common.models import ApprovalChain

    run_ids = list(session.runs.values_list("id", flat=True))
    ApprovalChain.objects.filter(
        organization=request.organization, resource_type="agent.action", resource_id__in=run_ids, status="pending"
    ).update(status="approved")

    run = AgentRun.objects.create(session=session, event=event, user_text="approve", status="queued")
    run_agent_turn.delay(str(run.id))
    return Response({"run_id": str(run.id), "status": run.status, "approved": session.pending_approvals}, status=status.HTTP_202_ACCEPTED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def agent_state(request, event_id):
    event = _event(request, event_id)
    if event is None:
        return Response({"detail": "Event access denied."}, status=status.HTTP_403_FORBIDDEN)
    sidecar = AgentEventState.objects.filter(event=event).first()
    if sidecar and sidecar.snapshot:
        return Response(sidecar.snapshot)
    # No agent activity yet — reconstruct a snapshot from the canonical event.
    from .adapters import DjangoEventStateStore

    se = DjangoEventStateStore().get(event.id.hex)
    return Response(se.snapshot() if se else {})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def agent_plan_approve(request, event_id):
    """Submit/approve the AI plan and advance the workflow (review → approval).

    This is the plan-level approval — distinct from approving an outbound action.
    It records a governed ApprovalChain and moves the event forward so the user
    can proceed to choosing vendors. It does NOT send anything.
    """
    event = _event(request, event_id, write=True)
    if event is None:
        return Response({"detail": "Event access denied."}, status=status.HTTP_403_FORBIDDEN)

    from agent.state import EventState, EventStateManager, can_transition
    from common.models import ApprovalChain

    from .adapters import DjangoEventStateStore

    store = DjangoEventStateStore()
    manager = EventStateManager(store=store)
    se = store.get(event.id.hex)
    if se is None:
        return Response({"detail": "No plan to approve yet."}, status=status.HTTP_409_CONFLICT)
    if can_transition(se.status, EventState.APPROVAL):
        manager.transition(se.event_id, EventState.APPROVAL)
    ApprovalChain.objects.get_or_create(
        organization=request.organization,
        resource_type="agent.plan",
        resource_id=event.id,
        defaults={"status": "approved"},
    )
    return Response({"status": "approved", "ai_state": store.get(event.id.hex).status.value})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def agent_vendors(request, event_id):
    """Enriched vendor/venue suggestions: the AI shortlist joined with marketplace data."""
    event = _event(request, event_id)
    if event is None:
        return Response({"detail": "Event access denied."}, status=status.HTTP_403_FORBIDDEN)

    from marketplace.models import Vendor

    sidecar = AgentEventState.objects.filter(event=event).first()
    refs = (sidecar.vendors if sidecar else []) or []
    ids = [r.get("vendor_id") for r in refs if r.get("vendor_id")]
    vendors = {str(v.id): v for v in Vendor.objects.filter(id__in=ids)}

    results = []
    for r in refs:
        v = vendors.get(str(r.get("vendor_id")))
        results.append({
            "vendor_id": r.get("vendor_id"),
            "name": r.get("name"),
            "category": r.get("category"),
            "score": r.get("score", 0),
            "reasons": r.get("reasons", []),
            "status": r.get("status", "shortlisted"),
            "price_from_minor": v.price_from_minor if v else None,
            "currency": v.currency if v else None,
            "rating_avg": float(v.rating_avg) if v else None,
            "review_count": v.review_count if v else None,
            "contact_phone": v.contact_phone if v else "",
            "website": v.website if v else "",
            "latitude": v.latitude if v else None,
            "longitude": v.longitude if v else None,
            "external_source": v.external_source if v else "",
            "service_areas": v.service_areas if v else [],
        })
    return Response({"vendors": results})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def agent_shortlist(request, event_id):
    """Persist the user's selected vendors as an event shortlist (no outreach)."""
    event = _event(request, event_id, write=True)
    if event is None:
        return Response({"detail": "Event access denied."}, status=status.HTTP_403_FORBIDDEN)
    vendor_ids = request.data.get("vendor_ids") or []
    if not vendor_ids:
        return Response({"detail": "Select at least one vendor."}, status=status.HTTP_400_BAD_REQUEST)

    from marketplace.services import save_vendor_shortlist

    try:
        result = save_vendor_shortlist(event=event, vendor_ids=vendor_ids, source="user")
    except ValueError as exc:
        return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
    return Response(result)
