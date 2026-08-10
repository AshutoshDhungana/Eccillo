"""Structured logging, tracing, and metrics for the agent layer.

The spec (§Observability) asks us to log intent, tool calls, execution time,
failures, retries, token usage, latency, and user satisfaction.  This module
provides a lightweight, dependency-free implementation that records structured
spans in memory (so tests can assert on them) and mirrors them to the standard
logging framework (so they show up alongside the rest of the backend logs).
"""

from __future__ import annotations

import logging
import time
import uuid
from collections.abc import Iterator
from contextlib import contextmanager
from dataclasses import dataclass, field
from typing import Any

logger = logging.getLogger("eccillo.agent")


@dataclass
class Span:
    """A single timed unit of work (a turn, a plan, a skill execution, an LLM call)."""

    name: str
    kind: str  # "turn" | "plan" | "skill" | "llm" | "workflow"
    span_id: str = field(default_factory=lambda: uuid.uuid4().hex[:12])
    parent_id: str | None = None
    started_at: float = field(default_factory=time.perf_counter)
    ended_at: float | None = None
    status: str = "ok"  # "ok" | "error" | "retry"
    attributes: dict[str, Any] = field(default_factory=dict)

    @property
    def duration_ms(self) -> float:
        end = self.ended_at if self.ended_at is not None else time.perf_counter()
        return round((end - self.started_at) * 1000, 2)

    def set(self, **attrs: Any) -> None:
        self.attributes.update(attrs)

    def to_dict(self) -> dict[str, Any]:
        return {
            "span_id": self.span_id,
            "parent_id": self.parent_id,
            "name": self.name,
            "kind": self.kind,
            "status": self.status,
            "duration_ms": self.duration_ms,
            "attributes": self.attributes,
        }


@dataclass
class TokenUsage:
    prompt_tokens: int = 0
    completion_tokens: int = 0

    @property
    def total(self) -> int:
        return self.prompt_tokens + self.completion_tokens

    def add(self, other: "TokenUsage") -> None:
        self.prompt_tokens += other.prompt_tokens
        self.completion_tokens += other.completion_tokens


class Observer:
    """Collects spans and counters for one runtime.  Cheap to create per-turn."""

    def __init__(self, *, session_id: str | None = None):
        self.session_id = session_id
        self.spans: list[Span] = []
        self.token_usage = TokenUsage()
        self.counters: dict[str, int] = {}
        self._stack: list[Span] = []

    # -- metrics -------------------------------------------------------------
    def incr(self, name: str, by: int = 1) -> None:
        self.counters[name] = self.counters.get(name, 0) + by

    def record_tokens(self, usage: TokenUsage) -> None:
        self.token_usage.add(usage)

    # -- tracing -------------------------------------------------------------
    @contextmanager
    def span(self, name: str, kind: str, **attributes: Any) -> Iterator[Span]:
        parent = self._stack[-1] if self._stack else None
        span = Span(name=name, kind=kind, parent_id=parent.span_id if parent else None, attributes=dict(attributes))
        self._stack.append(span)
        self.spans.append(span)
        try:
            yield span
        except Exception as exc:  # noqa: BLE001 - record then re-raise
            span.status = "error"
            span.set(error=type(exc).__name__, error_message=str(exc))
            raise
        finally:
            span.ended_at = time.perf_counter()
            self._stack.pop()
            logger.info("agent_span %s", span.to_dict())

    # -- reporting -----------------------------------------------------------
    def summary(self) -> dict[str, Any]:
        return {
            "session_id": self.session_id,
            "span_count": len(self.spans),
            "total_duration_ms": round(sum(s.duration_ms for s in self.spans if s.parent_id is None), 2),
            "tokens": {
                "prompt": self.token_usage.prompt_tokens,
                "completion": self.token_usage.completion_tokens,
                "total": self.token_usage.total,
            },
            "counters": dict(self.counters),
            "errors": [s.to_dict() for s in self.spans if s.status == "error"],
        }
