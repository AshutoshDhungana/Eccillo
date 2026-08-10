"""Conversation layer (spec §Layer 1) — the thin Conversation API surface.

This is the seam a transport (DRF view, WebSocket consumer, CLI) binds to.  It
owns session ↔ event association and delegates everything else to the runtime.
It contains no business logic and no prompt text of its own.
"""

from __future__ import annotations

import uuid
from dataclasses import dataclass, field
from typing import Any

from .runtime import AgentResponse, AgentRuntime
from .state import StructuredEvent


@dataclass
class Session:
    session_id: str
    event_id: str
    organization_id: str | None = None
    user_id: str | None = None
    metadata: dict[str, Any] = field(default_factory=dict)


class ConversationEngine:
    """Maps conversation sessions to events and drives runtime turns."""

    def __init__(self, runtime: AgentRuntime | None = None):
        self.runtime = runtime or AgentRuntime()
        self._sessions: dict[str, Session] = {}

    def start_session(
        self,
        *,
        organization_id: str | None = None,
        user_id: str | None = None,
        event_id: str | None = None,
        **event_initial: Any,
    ) -> Session:
        """Open a session, creating a fresh structured event unless one is given."""
        if event_id is None:
            event = self.runtime.create_event(organization_id=organization_id, organizer_id=user_id, **event_initial)
            event_id = event.event_id
        session = Session(session_id=uuid.uuid4().hex, event_id=event_id, organization_id=organization_id, user_id=user_id)
        self._sessions[session.session_id] = session
        return session

    def get_session(self, session_id: str) -> Session:
        return self._sessions[session_id]

    def event(self, session_id: str) -> StructuredEvent:
        return self.runtime.state.get(self._sessions[session_id].event_id)

    async def send(self, session_id: str, message: str) -> AgentResponse:
        session = self._sessions[session_id]
        return await self.runtime.handle_message(
            session_id=session.session_id,
            event_id=session.event_id,
            user_text=message,
            organization_id=session.organization_id,
            user_id=session.user_id,
        )
