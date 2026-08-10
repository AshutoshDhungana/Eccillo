"""Google Gemini provider.

Implemented directly against the Generative Language REST API with ``httpx`` so
it needs no extra SDK.  Structured output uses ``responseMimeType`` +
``responseSchema``; because Gemini's schema dialect is a subset of JSON Schema,
:func:`to_gemini_schema` translates the orchestrator's schemas (type unions,
``additionalProperties``) into the accepted form.
"""

from __future__ import annotations

import json
from typing import Any

from ..errors import AgentError, ProviderNotConfigured, RetryableError
from ..observability import TokenUsage
from .base import LLMClient, LLMResponse, Message, StructuredResponse

_TYPE_MAP = {"string": "STRING", "integer": "INTEGER", "number": "NUMBER", "boolean": "BOOLEAN", "object": "OBJECT", "array": "ARRAY"}


def to_gemini_schema(schema: dict[str, Any]) -> dict[str, Any]:
    """Convert a standard JSON Schema (object root) into Gemini's schema dialect."""
    if not isinstance(schema, dict):
        return {"type": "STRING"}

    raw_type = schema.get("type", "string")
    nullable = False
    if isinstance(raw_type, list):  # e.g. ["string", "null"]
        nullable = "null" in raw_type
        non_null = [t for t in raw_type if t != "null"]
        raw_type = non_null[0] if non_null else "string"

    out: dict[str, Any] = {"type": _TYPE_MAP.get(raw_type, "STRING")}
    if nullable:
        out["nullable"] = True
    if "enum" in schema:
        out["enum"] = schema["enum"]
    if raw_type == "object":
        props = schema.get("properties", {})
        out["properties"] = {k: to_gemini_schema(v) for k, v in props.items()}
        if schema.get("required"):
            out["required"] = list(schema["required"])
    if raw_type == "array" and "items" in schema:
        out["items"] = to_gemini_schema(schema["items"])
    return out


class GeminiClient(LLMClient):
    provider = "gemini"

    def __init__(self, *, api_key: str, model: str, temperature: float = 0.2, max_tokens: int = 2048, timeout: float = 60.0, base_url: str = "https://generativelanguage.googleapis.com"):
        super().__init__(model=model, temperature=temperature, max_tokens=max_tokens)
        self._api_key = api_key
        self._base_url = base_url.rstrip("/")
        self._timeout = timeout

    def _payload(self, messages: list[Message], *, temperature: float | None) -> dict[str, Any]:
        system = "\n\n".join(m.content for m in messages if m.role == "system")
        contents = [
            {"role": "model" if m.role == "assistant" else "user", "parts": [{"text": m.content}]}
            for m in messages
            if m.role != "system"
        ]
        payload: dict[str, Any] = {
            "contents": contents,
            "generationConfig": {
                "temperature": self.temperature if temperature is None else temperature,
                "maxOutputTokens": self.max_tokens,
            },
        }
        if system:
            payload["systemInstruction"] = {"parts": [{"text": system}]}
        return payload

    async def _post(self, payload: dict[str, Any]) -> dict[str, Any]:
        import httpx

        url = f"{self._base_url}/v1beta/models/{self.model}:generateContent"
        async with httpx.AsyncClient(timeout=self._timeout) as client:
            try:
                resp = await client.post(url, params={"key": self._api_key}, json=payload)
            except httpx.RequestError as exc:
                raise RetryableError(f"Cannot reach Gemini at {self._base_url}: {exc}") from exc
            if resp.status_code >= 400:
                try:
                    detail = (resp.json() or {}).get("error", {}).get("message", "") or resp.text[:300]
                except ValueError:
                    detail = resp.text[:300]
                if resp.status_code in (401, 403):
                    raise ProviderNotConfigured(f"Gemini rejected the API key (HTTP {resp.status_code}): {detail}")
                if resp.status_code == 404:
                    raise ProviderNotConfigured(f"Gemini model '{self.model}' not found: {detail}")
                if resp.status_code >= 500:
                    raise RetryableError(f"Gemini server error ({resp.status_code}): {detail}")
                raise AgentError(f"Gemini request failed ({resp.status_code}): {detail}")
            return resp.json()

    @staticmethod
    def _text(data: dict[str, Any]) -> str:
        candidates = data.get("candidates") or []
        if not candidates:
            return ""
        parts = candidates[0].get("content", {}).get("parts", [])
        return "".join(p.get("text", "") for p in parts).strip()

    @staticmethod
    def _usage(data: dict[str, Any]) -> TokenUsage:
        meta = data.get("usageMetadata", {})
        return TokenUsage(prompt_tokens=meta.get("promptTokenCount", 0) or 0, completion_tokens=meta.get("candidatesTokenCount", 0) or 0)

    async def complete(self, messages: list[Message], *, temperature: float | None = None) -> LLMResponse:
        data = await self._post(self._payload(messages, temperature=temperature))
        return LLMResponse(text=self._text(data), usage=self._usage(data), raw=data)

    async def structured(self, messages: list[Message], *, schema: dict[str, Any], schema_name: str = "response") -> StructuredResponse:
        payload = self._payload(messages, temperature=None)
        payload["generationConfig"]["responseMimeType"] = "application/json"
        payload["generationConfig"]["responseSchema"] = to_gemini_schema(schema)
        data = await self._post(payload)
        text = self._text(data) or "{}"
        return StructuredResponse(data=json.loads(text), usage=self._usage(data), raw=data)
