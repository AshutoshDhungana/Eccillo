"""Shared, transaction-safe mutation boundary for event-owned data.

The HTTP layer uses these guarantees when it changes an event workspace:
serialize writes for the event, make a supplied
business idempotency key safe to retry, advance the optimistic revision, and
emit an outbox fact in the *same* database transaction.  This module is kept
small on purpose so individual pillars can own their model-specific work
without reimplementing those cross-cutting guarantees.
"""

from __future__ import annotations

from collections.abc import Callable, Mapping
from dataclasses import dataclass
import hashlib
import json
from typing import Any

from django.db import transaction
from django.db.models import F

from .api import emit
from .models import DomainEvent


class EventMutationError(RuntimeError):
    """Base error for a rejected event mutation."""


class EventRevisionConflict(EventMutationError):
    """Raised when a caller attempts to apply a stale event revision."""


class EventMutationIdempotencyConflict(EventMutationError):
    """Raised when a business key was reused for a different event mutation."""


@dataclass(frozen=True)
class EventMutationResult:
    """The normalized result returned by every event mutation service."""

    result: dict[str, Any]
    event_revision: int
    event_id: str
    idempotent_replay: bool = False


def _normalized_key(key: str | None) -> str | None:
    if key is None:
        return None
    normalized = str(key).strip()
    if not normalized:
        return None
    if len(normalized) > 255:
        raise EventMutationError("idempotency_key must be at most 255 characters.")
    return normalized


def mutation_fingerprint(value: Mapping[str, Any] | None) -> str:
    """Hash request input deterministically without requiring model-specific code."""

    def encode_unknown(item):
        primary_key = getattr(item, "pk", None)
        return str(primary_key if primary_key is not None else item)

    encoded = json.dumps(
        dict(value or {}),
        sort_keys=True,
        separators=(",", ":"),
        default=encode_unknown,
    )
    return hashlib.sha256(encoded.encode("utf-8")).hexdigest()


def execute_event_mutation(
    *,
    event,
    organization,
    actor,
    event_type: str,
    mutation: Callable[[Any], Mapping[str, Any] | None],
    payload: Mapping[str, Any] | None = None,
    idempotency_payload: Mapping[str, Any] | None = None,
    idempotency_key: str | None = None,
    expected_revision: int | None = None,
    schema_version: int = 1,
) -> EventMutationResult:
    """Run one event-owned mutation with locking, idempotency, and an outbox fact.

    ``mutation`` receives the locked, authoritative ``Event`` instance and
    must return JSON-compatible output.  It must not open a new durable
    workflow; its changes remain inside this transaction.  An existing outbox
    record for the same idempotency key is treated as a successful replay and
    its recorded result is returned without invoking ``mutation`` again.
    """

    if event.organization_id != organization.id:
        raise EventMutationError("Event organization does not match mutation organization.")
    key = _normalized_key(idempotency_key)
    request_fingerprint = mutation_fingerprint(
        idempotency_payload if idempotency_payload is not None else payload
    )

    # Import lazily to avoid a common -> planning import during app loading.
    from planning.models import Event

    with transaction.atomic():
        locked_event = Event.objects.select_for_update().get(pk=event.pk)
        if locked_event.organization_id != organization.id:
            raise EventMutationError("Locked event organization does not match mutation organization.")
        if expected_revision is not None and locked_event.revision != expected_revision:
            raise EventRevisionConflict(
                "The event changed after this mutation was prepared "
                f"(expected revision {expected_revision}, found {locked_event.revision})."
            )

        if key:
            prior = DomainEvent.objects.filter(
                organization=organization,
                dedupe_key=key,
            ).first()
            if prior is not None:
                if prior.type != event_type or prior.event_id != locked_event.id:
                    raise EventMutationIdempotencyConflict(
                        "idempotency_key was already used for another event mutation."
                    )
                prior_fingerprint = (prior.payload or {}).get("idempotency_fingerprint")
                if prior_fingerprint is not None and prior_fingerprint != request_fingerprint:
                    raise EventMutationIdempotencyConflict(
                        "idempotency_key was already used with a different mutation payload."
                    )
                prior_result = (prior.payload or {}).get("result")
                if not isinstance(prior_result, dict):
                    raise EventMutationIdempotencyConflict(
                        "idempotency_key refers to a legacy mutation without a replayable result."
                    )
                prior_revision = int((prior.payload or {}).get("event_revision", locked_event.revision))
                return EventMutationResult(
                    result=prior_result,
                    event_revision=prior_revision,
                    event_id=str(locked_event.id),
                    idempotent_replay=True,
                )

        returned = mutation(locked_event) or {}
        if not isinstance(returned, Mapping):
            raise EventMutationError("Event mutation services must return a JSON object.")
        result = dict(returned)

        # Some legacy planning models still emit revision bumps from signals.
        # This explicit bump remains the single common guarantee for every
        # pillar; extra bumps merely make stale proposals fail more safely.
        Event.objects.filter(pk=locked_event.pk).update(revision=F("revision") + 1)
        locked_event.refresh_from_db(fields=["revision"])

        event_payload = {
            **dict(payload or {}),
            "result": result,
            "event_revision": locked_event.revision,
            "idempotency_fingerprint": request_fingerprint,
        }
        emit(
            event_type,
            organization,
            locked_event,
            actor,
            event_payload,
            schema_version=schema_version,
            dedupe_key=key,
        )
        return EventMutationResult(
            result=result,
            event_revision=locked_event.revision,
            event_id=str(locked_event.id),
        )
