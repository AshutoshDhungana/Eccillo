"""KeyValueMemoryStore backed by the AgentMemory table (org + user tiers)."""

from __future__ import annotations

from typing import Any


class DjangoKeyValueMemoryStore:
    """Satisfies ``agent.memory.KeyValueMemoryStore``."""

    def get_all(self, scope: str) -> dict[str, Any]:
        from orchestration.models import AgentMemory

        row = AgentMemory.objects.filter(scope=scope).first()
        return dict(row.data) if row else {}

    def set(self, scope: str, key: str, value: Any) -> None:
        self.update(scope, {key: value})

    def update(self, scope: str, values: dict[str, Any]) -> None:
        from orchestration.models import AgentMemory

        row, _ = AgentMemory.objects.get_or_create(scope=scope)
        data = dict(row.data or {})
        data.update(values)
        row.data = data
        row.save(update_fields=["data", "updated_at"])
