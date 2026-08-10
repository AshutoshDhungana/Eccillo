"""Test doubles for the agent layer.

``FakeLLM`` is a deterministic, rule-based stand-in for an ``LLMClient`` used
only by the test suite (and quick offline smoke checks).  It is intentionally
NOT a shipped provider — the product talks only to real models.  Tests inject
it directly::

    runtime = AgentRuntime(llm=FakeLLM(), config=...)

It cooperates with the prompt builder's ``AGENT_TASK:`` marker line the same way
a real model reads instructions, and does just enough heuristic extraction to
drive the orchestration path without a network call.
"""

from __future__ import annotations

import re
from typing import Any

from agent.llm.base import LLMClient, LLMResponse, Message, StructuredResponse
from agent.observability import TokenUsage

_EVENT_TYPES = ["birthday", "wedding", "conference", "hackathon", "festival", "workshop", "sports", "meetup", "seminar"]

_INTENT_KEYWORDS = {
    "approve": ["approve", "confirm", "go ahead", "book it", "yes proceed"],
    "summary": ["summary", "summarize", "status", "where are we", "brief"],
    "email": ["email", "invite", "invitation", "rsvp"],
    "plan_event": ["plan", "organi", "help me set up", "arrange", "throw", "host"],
    "provide_info": ["budget", "guests", "people", "date", "venue", "attendees", "on ", "at "],
}


def _task_marker(messages: list[Message]) -> str:
    for m in messages:
        if m.role == "system" and m.content.strip():
            first = m.content.strip().splitlines()[0]
            if first.startswith("AGENT_TASK:"):
                return first.split(":", 1)[1].strip()
    return "respond"


def _last_user(messages: list[Message]) -> str:
    for m in reversed(messages):
        if m.role == "user":
            return m.content
    return ""


def _directive(messages: list[Message], key: str) -> str | None:
    for m in messages:
        if m.role == "system":
            for line in m.content.splitlines():
                if line.startswith(f"{key}:"):
                    return line.split(":", 1)[1].strip()
    return None


def _extract_fields(text: str) -> dict[str, Any]:
    low = text.lower()
    fields: dict[str, Any] = {}
    for et in _EVENT_TYPES:
        if et in low:
            fields["event_type"] = et
            break
    m = re.search(r"(\d[\d,]{1,7})\s*(guests|people|attendees|pax)", low)
    if m:
        fields["guest_count"] = int(m.group(1).replace(",", ""))
    m = re.search(r"(?:budget|around|about|upto|up to|under)\D{0,6}?([\d,]{3,12})", low) or re.search(r"(?:npr|rs\.?|\$|usd)\s*([\d,]{3,12})", low)
    if m:
        fields["budget"] = int(m.group(1).replace(",", ""))
    m = re.search(r"(?:call it|called|name it|named|titled|title[:\s])\s+(.+?)(?:\s+with\b|\s+for\b|\s+on\b|\s+at\b|,|\.|$)", text, re.I)
    if m:
        fields["title"] = m.group(1).strip()
    m = re.search(r"(\d{4}-\d{2}-\d{2})", text)
    if m:
        fields["date"] = m.group(1)
    m = re.search(r"\bin ([A-Z][a-z]{2,30})\b", text)
    if m:
        fields["location"] = m.group(1).strip()
    return fields


def _coerce(data: dict[str, Any], schema: dict[str, Any]) -> dict[str, Any]:
    out = dict(data)
    for key, spec in schema.get("properties", {}).items():
        if key not in out:
            out[key] = {} if spec.get("type") == "object" else None
    return out


class FakeLLM(LLMClient):
    provider = "fake"

    def __init__(self, model: str = "fake-1"):
        super().__init__(model=model, temperature=0.0, max_tokens=2048)

    async def complete(self, messages: list[Message], *, temperature: float | None = None) -> LLMResponse:
        task = _task_marker(messages)
        usage = TokenUsage(prompt_tokens=8, completion_tokens=8)
        if task == "clarify":
            field = _directive(messages, "CLARIFY_FIELD") or "the next detail"
            q = {
                "budget": "Roughly what budget are you working with?",
                "guest_count": "Approximately how many guests are you expecting?",
                "date": "What date do you have in mind?",
                "venue": "Do you have a venue in mind?",
                "event_type": "What kind of event is this?",
                "title": "What would you like to call this event?",
            }.get(field, f"Could you share {field.replace('_', ' ')}?")
            return LLMResponse(text=q, usage=usage)
        if task == "summary":
            return LLMResponse(text=_directive(messages, "SUMMARY_BODY") or "Here is where the plan stands.", usage=usage)
        body = _directive(messages, "RESPONSE_BODY")
        return LLMResponse(text=body or "Understood.", usage=usage)

    async def structured(self, messages: list[Message], *, schema: dict[str, Any], schema_name: str = "response") -> StructuredResponse:
        user = _last_user(messages)
        usage = TokenUsage(prompt_tokens=8, completion_tokens=8)
        if schema_name == "intent":
            low = user.lower()
            intent = "plan_event"
            for name, kws in _INTENT_KEYWORDS.items():
                if any(k in low for k in kws):
                    intent = name
                    break
            fields = _extract_fields(user)
            if fields and intent == "plan_event" and not any(k in low for k in _INTENT_KEYWORDS["plan_event"]):
                intent = "provide_info"
            data = {
                "intent": intent,
                "event_type": fields.get("event_type"),
                "extracted_fields": {k: v for k, v in fields.items() if k != "event_type"},
                "confidence": 0.6,
            }
            return StructuredResponse(data=_coerce(data, schema), usage=usage)
        return StructuredResponse(data=_coerce({}, schema), usage=usage)
