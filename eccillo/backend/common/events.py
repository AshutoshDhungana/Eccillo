"""
Domain event outbox helper.
In the hackathon MVP this just logs; Phase 2+ wires it to Kafka/NATS.
"""
import json
import logging
from datetime import datetime, timezone
from typing import Any

logger = logging.getLogger("eccillo.events")


def publish(
    event_type: str,
    payload: dict[str, Any],
    event_id: str | None = None,
    organization_id: str | None = None,
    actor_type: str = "user",
) -> None:
    """Emit a domain event. Swap the body for a real bus in Phase 2."""
    envelope = {
        "type": event_type,
        "event_id": str(event_id) if event_id else None,
        "organization_id": str(organization_id) if organization_id else None,
        "actor_type": actor_type,
        "payload": payload,
        "emitted_at": datetime.now(timezone.utc).isoformat(),
    }
    logger.info("domain_event %s", json.dumps(envelope))
    # TODO Phase 2: push to Kafka/NATS topic "eccillo.events"
