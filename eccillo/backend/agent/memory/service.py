"""Layered memory (spec §Memory).

Four tiers with deliberately different lifetimes:

* **Conversation** — recent messages, short-lived, windowed.
* **Event** — the structured event; persistent, delegated to the state store.
* **Organization** — company preferences (brand, preferred vendors, approval rules).
* **User** — organizer preferences (favorite venues, writing style).

Only conversation memory is owned here; event memory is intentionally a
read-through to :class:`EventStateManager` so there is one source of truth.  Org
and user tiers use a pluggable store (in-memory default).
"""

from __future__ import annotations

from collections import defaultdict, deque
from dataclasses import dataclass, field
from typing import Any

from ..state import EventStateManager


@dataclass
class ConversationTurn:
    role: str
    content: str


class KeyValueMemoryStore:
    """Pluggable persistence for org/user memory (swap for Redis/ORM later)."""

    def __init__(self) -> None:
        self._data: dict[str, dict[str, Any]] = defaultdict(dict)

    def get_all(self, scope: str) -> dict[str, Any]:
        return dict(self._data.get(scope, {}))

    def set(self, scope: str, key: str, value: Any) -> None:
        self._data[scope][key] = value

    def update(self, scope: str, values: dict[str, Any]) -> None:
        self._data[scope].update(values)


@dataclass
class MemoryService:
    state_manager: EventStateManager
    window: int = 12
    store: KeyValueMemoryStore = field(default_factory=KeyValueMemoryStore)
    _conversations: dict[str, deque[ConversationTurn]] = field(default_factory=dict)

    # -- conversation memory -------------------------------------------------
    def add_turn(self, session_id: str, role: str, content: str) -> None:
        buf = self._conversations.setdefault(session_id, deque(maxlen=self.window))
        buf.append(ConversationTurn(role=role, content=content))

    def recent_turns(self, session_id: str) -> list[ConversationTurn]:
        return list(self._conversations.get(session_id, ()))

    # -- event memory (read-through to the single source of truth) -----------
    def event_snapshot(self, event_id: str) -> dict[str, Any]:
        return self.state_manager.get(event_id).snapshot()

    # -- organization memory -------------------------------------------------
    def org_memory(self, organization_id: str | None) -> dict[str, Any]:
        if not organization_id:
            return {}
        return self.store.get_all(f"org:{organization_id}")

    def remember_org(self, organization_id: str, values: dict[str, Any]) -> None:
        self.store.update(f"org:{organization_id}", values)

    # -- user memory ---------------------------------------------------------
    def user_memory(self, user_id: str | None) -> dict[str, Any]:
        if not user_id:
            return {}
        return self.store.get_all(f"user:{user_id}")

    def remember_user(self, user_id: str, values: dict[str, Any]) -> None:
        self.store.update(f"user:{user_id}", values)

    def relevant(self, *, organization_id: str | None, user_id: str | None) -> dict[str, Any]:
        """Bundle the org/user memory the prompt builder should surface."""
        return {"organization": self.org_memory(organization_id), "user": self.user_memory(user_id)}
