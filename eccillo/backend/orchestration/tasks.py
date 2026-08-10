"""Async agent-turn execution (Phase 3, Milestone 4).

One Celery task runs a whole conversation turn in the background:

    load run → rehydrate conversation memory + pending approvals →
    runtime.handle_message() → persist turns, run graph, state, approvals.

Everything the agent keeps in-process (conversation memory, ``_pending``) is
restored from the DB first, so a stateless HTTP request maps cleanly onto the
frozen runtime with no agent changes.
"""

from __future__ import annotations

import asyncio
import os

os.environ.setdefault("DJANGO_ALLOW_ASYNC_UNSAFE", "true")

from celery import shared_task  # noqa: E402
from django.utils import timezone  # noqa: E402


@shared_task(name="orchestration.run_agent_turn")
def run_agent_turn(run_id: str) -> str:
    from django.conf import settings

    from orchestration.adapters import build_runtime
    from orchestration.models import AgentRun, AgentRunStep, AgentTurn

    run = AgentRun.objects.select_related("session", "session__organization", "session__user", "event").get(pk=run_id)
    session = run.session
    run.status = "running"
    run.started_at = timezone.now()
    run.save(update_fields=["status", "started_at", "updated_at"])

    try:
        runtime = build_runtime(
            organization=session.organization,
            user=session.user,
            discover=getattr(settings, "AGENT_DISCOVERY_ENABLED", True),
        )
        sid = str(session.id)

        # 1) rehydrate prior conversation into memory (public API — no agent change)
        for turn in session.turns.all():
            runtime.memory.add_turn(sid, turn.role, turn.content)

        # 2) restore approval gates so an "approve" turn can execute them
        if session.pending_approvals:
            runtime._pending[sid] = list(session.pending_approvals)

        # 3) run the turn
        resp = asyncio.run(
            runtime.handle_message(
                session_id=sid,
                event_id=run.event.id.hex,
                user_text=run.user_text,
                organization_id=str(session.organization_id),
                user_id=str(session.user_id) if session.user_id else None,
            )
        )

        # 4) persist conversation + run graph
        AgentTurn.objects.create(session=session, role="user", content=run.user_text, run=run)
        AgentTurn.objects.create(session=session, role="assistant", content=resp.message, run=run)

        run.status = "completed"
        run.intent = resp.intent
        run.ai_state = resp.state
        run.message = resp.message
        run.clarifying = resp.clarifying
        run.missing_fields = resp.missing_fields
        run.plan = resp.plan or {}
        run.explanation = resp.explanation
        run.pending_approvals = resp.pending_approvals
        run.observability = resp.observability
        run.finished_at = timezone.now()
        run.save()

        AgentRunStep.objects.bulk_create([
            AgentRunStep(
                run=run,
                step_id=step_id,
                skill=result.get("skill", ""),
                outcome=result.get("outcome", ""),
                data=result.get("data", {}),
                explanation=result.get("explanation", []),
                error=result.get("error") or "",
                order=i,
            )
            for i, (step_id, result) in enumerate(resp.results.items())
        ])

        session.pending_approvals = resp.pending_approvals
        session.save(update_fields=["pending_approvals", "updated_at"])

        # Governance + audit: map approvals to a chain and emit a durable fact.
        _sync_approvals(run, resp)
        _emit_turn_event(run, resp)
        return str(run.id)

    except Exception as exc:  # noqa: BLE001 - record failure on the durable run
        run.status = "failed"
        run.error = f"{type(exc).__name__}: {exc}"
        run.finished_at = timezone.now()
        run.save(update_fields=["status", "error", "finished_at", "updated_at"])
        raise


def _sync_approvals(run, resp) -> None:
    """Record a governed ApprovalChain for a run that reached an approval gate."""
    if not resp.pending_approvals:
        return
    from accounts.models import Membership
    from common.models import ApprovalChain, ApprovalStep

    chain, created = ApprovalChain.objects.get_or_create(
        organization=run.session.organization,
        resource_type="agent.action",
        resource_id=run.id,
        defaults={"status": "pending"},
    )
    if created:
        membership = Membership.objects.filter(user=run.session.user, organization=run.session.organization).first()
        if membership:
            ApprovalStep.objects.create(chain=chain, approver=membership, sequence=1)


def _emit_turn_event(run, resp) -> None:
    """Emit a durable outbox fact for the completed turn (audit + delivery)."""
    try:
        from common.api import emit

        emit(
            "agent.turn.completed",
            run.session.organization,
            run.event,
            run.session.user,
            {"run_id": str(run.id), "intent": resp.intent, "state": resp.state},
        )
    except Exception:  # noqa: BLE001 - auditing must never fail a completed turn
        pass


@shared_task(name="orchestration.dispatch_outbox")
def dispatch_outbox(limit: int = 200) -> int:
    """Deliver pending transactional-outbox events.

    The barebone platform has no external consumers yet, so 'delivery' marks the
    durable record delivered.  This replaces the previous no-op hook so events
    stop accumulating in ``pending`` forever; real consumers slot in here.
    """
    from django.utils import timezone

    from common.models import DomainEvent

    now = timezone.now()
    delivered = 0
    for event in DomainEvent.objects.filter(delivery_status="pending").order_by("created_at")[:limit]:
        event.delivery_status = "delivered"
        event.attempts += 1
        event.last_attempt_at = now
        event.published_at = now
        event.save(update_fields=["delivery_status", "attempts", "last_attempt_at", "published_at", "updated_at"])
        delivered += 1
    return delivered
