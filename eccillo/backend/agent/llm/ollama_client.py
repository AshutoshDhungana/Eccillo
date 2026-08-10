"""Ollama provider — local, offline, no API key.

Talks to a running Ollama daemon (default ``http://localhost:11434``) via its
native chat API with ``httpx``.  Structured output uses Ollama's ``format``
field, which accepts a JSON Schema and constrains generation to it.

This is the recommended way to run the agent fully offline / on-prem::

    ollama pull llama3.1
    ollama serve            # usually already running
    AGENT_LLM_PROVIDER=ollama python -m agent.chat
"""

from __future__ import annotations

import json
from typing import Any

from ..errors import AgentError, ProviderNotConfigured, RetryableError
from ..observability import TokenUsage
from .base import LLMClient, LLMResponse, Message, StructuredResponse


class OllamaClient(LLMClient):
    provider = "ollama"

    def __init__(self, *, model: str, temperature: float = 0.2, max_tokens: int = 2048, timeout: float = 120.0, base_url: str = "http://localhost:11434"):
        super().__init__(model=model, temperature=temperature, max_tokens=max_tokens)
        self._base_url = base_url.rstrip("/")
        self._timeout = timeout

    def _body(self, messages: list[Message], *, temperature: float | None) -> dict[str, Any]:
        return {
            "model": self.model,
            "messages": [{"role": m.role, "content": m.content} for m in messages],
            "stream": False,
            "options": {
                "temperature": self.temperature if temperature is None else temperature,
                "num_predict": self.max_tokens,
            },
        }

    async def _post(self, body: dict[str, Any]) -> dict[str, Any]:
        import httpx

        async with httpx.AsyncClient(timeout=self._timeout) as client:
            try:
                resp = await client.post(f"{self._base_url}/api/chat", json=body)
            except httpx.RequestError as exc:
                raise ProviderNotConfigured(
                    f"Cannot reach Ollama at {self._base_url}. Is the daemon running? (run: ollama serve)",
                    details={"error": str(exc)},
                ) from exc
            if resp.status_code >= 400:
                try:
                    detail = (resp.json() or {}).get("error", "") or resp.text[:200]
                except ValueError:
                    detail = resp.text[:200]
                if resp.status_code == 404 or "not found" in detail.lower():
                    installed = await self._installed_models(client)
                    hint = f" Installed models: {', '.join(installed)}." if installed else ""
                    raise ProviderNotConfigured(
                        f"Ollama model '{self.model}' is not available. Pull it first:  ollama pull {self.model}.{hint}",
                        details={"status": resp.status_code, "detail": detail, "installed": installed},
                    )
                if resp.status_code >= 500:
                    raise RetryableError(f"Ollama server error ({resp.status_code}): {detail}")
                raise AgentError(f"Ollama request failed ({resp.status_code}): {detail}")
            return resp.json()

    async def _installed_models(self, client: Any) -> list[str]:
        """Best-effort list of locally pulled models (for friendlier errors)."""
        try:
            resp = await client.get(f"{self._base_url}/api/tags")
            return [m.get("name", "") for m in (resp.json().get("models") or [])]
        except Exception:  # noqa: BLE001 - diagnostics only, never raise from here
            return []

    @staticmethod
    def _usage(data: dict[str, Any]) -> TokenUsage:
        return TokenUsage(prompt_tokens=data.get("prompt_eval_count", 0) or 0, completion_tokens=data.get("eval_count", 0) or 0)

    async def complete(self, messages: list[Message], *, temperature: float | None = None) -> LLMResponse:
        data = await self._post(self._body(messages, temperature=temperature))
        text = (data.get("message", {}) or {}).get("content", "")
        return LLMResponse(text=text.strip(), usage=self._usage(data), raw=data)

    async def structured(self, messages: list[Message], *, schema: dict[str, Any], schema_name: str = "response") -> StructuredResponse:
        body = self._body(messages, temperature=None)
        body["format"] = schema  # Ollama constrains generation to this JSON Schema.
        data = await self._post(body)
        content = (data.get("message", {}) or {}).get("content", "") or "{}"
        return StructuredResponse(data=json.loads(content), usage=self._usage(data), raw=data)
