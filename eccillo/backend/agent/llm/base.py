"""Provider-agnostic LLM client contract.

The orchestrator depends only on this interface (§Guiding Principle 2 — separate
reasoning from execution).  Concrete providers (OpenAI, Anthropic, Mock) live in
sibling modules and are selected by :mod:`agent.llm.factory`.

Two capabilities are exposed:

* ``complete`` — free-form natural-language generation (clarifying questions,
  summaries, explanations).  Reasoning only; it must never execute anything.
* ``structured`` — constrained generation against a JSON Schema, used for intent
  detection and field extraction where the orchestrator needs machine-readable
  output it can validate.
"""

from __future__ import annotations

import abc
from dataclasses import dataclass, field
from typing import Any

from ..observability import TokenUsage


@dataclass
class Message:
    role: str  # "system" | "user" | "assistant"
    content: str


@dataclass
class LLMResponse:
    text: str
    usage: TokenUsage = field(default_factory=TokenUsage)
    raw: Any = None


@dataclass
class StructuredResponse:
    data: dict[str, Any]
    usage: TokenUsage = field(default_factory=TokenUsage)
    raw: Any = None


class LLMClient(abc.ABC):
    """Abstract async LLM client.  All providers implement this surface."""

    provider: str = "abstract"

    def __init__(self, *, model: str, temperature: float = 0.2, max_tokens: int = 2048):
        self.model = model
        self.temperature = temperature
        self.max_tokens = max_tokens

    @abc.abstractmethod
    async def complete(self, messages: list[Message], *, temperature: float | None = None) -> LLMResponse:
        """Return a free-form completion for the given conversation."""

    @abc.abstractmethod
    async def structured(
        self,
        messages: list[Message],
        *,
        schema: dict[str, Any],
        schema_name: str = "response",
    ) -> StructuredResponse:
        """Return JSON constrained to ``schema`` (JSON-Schema, object at root)."""
