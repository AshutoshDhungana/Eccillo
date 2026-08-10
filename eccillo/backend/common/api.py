import hashlib
import json
import logging

from django.db import IntegrityError, transaction
from rest_framework.response import Response
from rest_framework.exceptions import APIException
from rest_framework.views import exception_handler

from .models import IdempotencyRecord, DomainEvent


logger = logging.getLogger(__name__)


def problem_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        return response
    detail = response.data.get("detail", "Request failed.") if isinstance(response.data, dict) else "Request failed."
    response.data = {"type": f"https://eccillo.dev/problems/{response.status_code}", "title": detail, "status": response.status_code, "detail": detail, "errors": response.data}
    response["Content-Type"] = "application/problem+json"
    return response


def emit(
    event_type,
    organization,
    event=None,
    actor=None,
    payload=None,
    *,
    schema_version=1,
    dedupe_key=None,
    enqueue_delivery=True,
):
    """Persist a transactional outbox event and request asynchronous delivery.

    The caller should invoke this inside the same ``transaction.atomic`` block
    as its domain write.  The dispatcher is only enqueued through
    ``transaction.on_commit``; a rolled-back domain write can therefore never
    leak an event.  A transient broker failure is intentionally non-fatal: the
    durable pending row will be recovered by the next outbox worker sweep.
    """

    if not event_type:
        raise ValueError("event_type is required")
    if event is not None and event.organization_id != organization.id:
        raise ValueError("Domain events must belong to the event's organization.")

    normalized_dedupe_key = str(dedupe_key).strip() if dedupe_key is not None else None
    if normalized_dedupe_key == "":
        normalized_dedupe_key = None
    if normalized_dedupe_key and len(normalized_dedupe_key) > 255:
        raise ValueError("dedupe_key must be at most 255 characters.")

    values = {
        "type": str(event_type),
        "organization": organization,
        "event": event,
        "actor": actor,
        "payload": payload or {},
        "schema_version": max(1, int(schema_version or 1)),
        "dedupe_key": normalized_dedupe_key,
    }

    # The inner savepoint lets a duplicate idempotency key be recovered without
    # poisoning an enclosing domain transaction.
    try:
        with transaction.atomic():
            domain_event = DomainEvent.objects.create(**values)
    except IntegrityError:
        if not normalized_dedupe_key:
            raise
        domain_event = DomainEvent.objects.get(
            organization=organization,
            dedupe_key=normalized_dedupe_key,
        )
        # Reusing a business idempotency key for a different fact would hide a
        # producer bug and make an at-least-once stream non-auditable.  Treat it
        # the same way as an HTTP idempotency-key payload mismatch.
        if (
            domain_event.type != values["type"]
            or domain_event.event_id != getattr(event, "id", None)
            or domain_event.payload != values["payload"]
            or domain_event.schema_version != values["schema_version"]
        ):
            raise ValueError("dedupe_key was already used for a different domain event.")

    if enqueue_delivery:
        transaction.on_commit(_request_outbox_delivery)
    return domain_event


def _request_outbox_delivery():
    """Ask the async worker to deliver pending outbox events (best-effort).

    Dispatched by name so ``common`` stays decoupled from ``orchestration``.  If
    Celery is unavailable the call is a safe no-op — a periodic sweep or the
    ``dispatch_outbox`` management command recovers pending rows.
    """
    try:
        from django.conf import settings

        # In eager mode (tests/dev) send_task has no effect and warns; skip it.
        if getattr(settings, "CELERY_TASK_ALWAYS_EAGER", False):
            return
        from config import celery_app

        if celery_app is not None:
            celery_app.send_task("orchestration.dispatch_outbox")
    except Exception:  # noqa: BLE001 - delivery is best-effort; never block a write
        pass


def idempotent(request, handler):
    key = request.headers.get("Idempotency-Key")
    if not key:
        return handler()
    if not getattr(request, "organization", None):
        raise APIException("An organization-scoped access token is required.")
    path = request.path
    digest = hashlib.sha256(json.dumps(request.data, sort_keys=True, default=str).encode()).hexdigest()
    record = IdempotencyRecord.objects.filter(organization=request.organization, key=key, method=request.method, path=path).first()
    if record:
        if record.request_hash != digest:
            raise APIException("Idempotency key was already used with a different request.")
        return Response(record.response_body, status=record.status_code)
    response = handler()
    IdempotencyRecord.objects.create(organization=request.organization, key=key, method=request.method, path=path, request_hash=digest, status_code=response.status_code, response_body=dict(response.data or {}))
    return response
