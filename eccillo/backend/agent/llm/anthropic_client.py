"""Anthropic provider (alternative to OpenAI).

Structured output is achieved with a single forced tool call whose input schema
is the requested JSON schema — the idiomatic way to get guaranteed-shape JSON
out of Claude.
"""

from __future__ import annotations

from typing import Any

from ..observability import TokenUsage
from .base import LLMClient, LLMResponse, Message, StructuredResponse


class AnthropicClient(LLMClient):
    provider = "anthropic"

    def __init__(self, *, api_key: str, model: str, temperature: float = 0.2, max_tokens: int = 2048, timeout: float = 60.0):
        super().__init__(model=model, temperature=temperature, max_tokens=max_tokens)
        from anthropic import AsyncAnthropic

        self._client = AsyncAnthropic(api_key=api_key, timeout=timeout)

    @staticmethod
    def _split(messages: list[Message]) -> tuple[str, list[dict[str, str]]]:
        system = "\n\n".join(m.content for m in messages if m.role == "system")
        turns = [{"role": m.role, "content": m.content} for m in messages if m.role != "system"]
        return system, turns

    @staticmethod
    def _usage(raw: Any) -> TokenUsage:
        usage = getattr(raw, "usage", None)
        if not usage:
            return TokenUsage()
        return TokenUsage(
            prompt_tokens=getattr(usage, "input_tokens", 0) or 0,
            completion_tokens=getattr(usage, "output_tokens", 0) or 0,
        )

    async def complete(self, messages: list[Message], *, temperature: float | None = None) -> LLMResponse:
        system, turns = self._split(messages)
        raw = await self._client.messages.create(
            model=self.model,
            system=system,
            messages=turns,
            temperature=self.temperature if temperature is None else temperature,
            max_tokens=self.max_tokens,
        )
        text = "".join(block.text for block in raw.content if getattr(block, "type", None) == "text")
        return LLMResponse(text=text.strip(), usage=self._usage(raw), raw=raw)

    async def structured(
        self,
        messages: list[Message],
        *,
        schema: dict[str, Any],
        schema_name: str = "response",
    ) -> StructuredResponse:
        system, turns = self._split(messages)
        tool_name = f"emit_{schema_name}"
        raw = await self._client.messages.create(
            model=self.model,
            system=system,
            messages=turns,
            temperature=self.temperature,
            max_tokens=self.max_tokens,
            tools=[{"name": tool_name, "description": f"Emit the {schema_name} object.", "input_schema": schema}],
            tool_choice={"type": "tool", "name": tool_name},
        )
        data: dict[str, Any] = {}
        for block in raw.content:
            if getattr(block, "type", None) == "tool_use":
                data = dict(block.input)
                break
        return StructuredResponse(data=data, usage=self._usage(raw), raw=raw)
