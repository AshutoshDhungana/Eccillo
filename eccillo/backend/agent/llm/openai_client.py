"""OpenAI provider (default for the build-week stack).

Uses the async client and Structured Outputs (``response_format`` with a JSON
schema) so the orchestrator receives guaranteed-parseable JSON for intent
detection and field extraction.

Setting ``base_url`` points the same client at any OpenAI-compatible server —
vLLM, LM Studio, OpenRouter, Together, Groq, etc. — so those work without a
dedicated provider class.
"""

from __future__ import annotations

import json
from typing import Any

from ..observability import TokenUsage
from .base import LLMClient, LLMResponse, Message, StructuredResponse


class OpenAIClient(LLMClient):
    provider = "openai"

    def __init__(self, *, api_key: str, model: str, temperature: float = 0.2, max_tokens: int = 2048, timeout: float = 60.0, base_url: str | None = None):
        super().__init__(model=model, temperature=temperature, max_tokens=max_tokens)
        # Imported lazily so the package imports cleanly without the SDK present.
        from openai import AsyncOpenAI

        self._client = AsyncOpenAI(api_key=api_key or "not-needed", timeout=timeout, base_url=base_url or None)

    def _dump(self, messages: list[Message]) -> list[dict[str, str]]:
        return [{"role": m.role, "content": m.content} for m in messages]

    @staticmethod
    def _usage(raw: Any) -> TokenUsage:
        usage = getattr(raw, "usage", None)
        if not usage:
            return TokenUsage()
        return TokenUsage(
            prompt_tokens=getattr(usage, "prompt_tokens", 0) or 0,
            completion_tokens=getattr(usage, "completion_tokens", 0) or 0,
        )

    async def complete(self, messages: list[Message], *, temperature: float | None = None) -> LLMResponse:
        raw = await self._client.chat.completions.create(
            model=self.model,
            messages=self._dump(messages),
            temperature=self.temperature if temperature is None else temperature,
            max_tokens=self.max_tokens,
        )
        text = raw.choices[0].message.content or ""
        return LLMResponse(text=text.strip(), usage=self._usage(raw), raw=raw)

    async def structured(
        self,
        messages: list[Message],
        *,
        schema: dict[str, Any],
        schema_name: str = "response",
    ) -> StructuredResponse:
        raw = await self._client.chat.completions.create(
            model=self.model,
            messages=self._dump(messages),
            temperature=self.temperature,
            max_tokens=self.max_tokens,
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": schema_name,
                    "schema": schema,
                    "strict": True,
                },
            },
        )
        content = raw.choices[0].message.content or "{}"
        return StructuredResponse(data=json.loads(content), usage=self._usage(raw), raw=raw)
