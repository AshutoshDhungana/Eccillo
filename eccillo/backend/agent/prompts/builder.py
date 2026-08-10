"""Dynamic prompt composition (spec §Prompt Architecture).

Instead of one giant prompt, every LLM call is composed from small, relevant
slices:

    Global System Prompt
    + Current Event State
    + Current Workflow State
    + Available Skills
    + Relevant Memory
    + Recent Conversation

The first system line is always an ``AGENT_TASK:`` marker so the deterministic
mock client can branch; real providers read it as an ordinary instruction.
"""

from __future__ import annotations

import json
from typing import Any

from ..llm import Message
from ..state import EventState, StructuredEvent

GLOBAL_SYSTEM = (
    "You are Eccillo's event-planning orchestrator's language interface. "
    "You provide reasoning, communication, and decision support only — you never "
    "invent business logic or fabricate confirmations. The platform is the source "
    "of truth; you read and describe the structured event state, never override it. "
    "Be concise, concrete, and warm. Never expose raw errors or internal field names to the user."
)


class PromptBuilder:
    def __init__(self, *, conversation_window: int = 12):
        self.conversation_window = conversation_window

    # -- context slices ------------------------------------------------------
    def _event_slice(self, event: StructuredEvent) -> str:
        snap = event.snapshot()
        # Keep the slice compact: scalars + collection counts, not full dumps.
        scalars = {k: snap.get(k) for k in ["event_type", "title", "date", "guest_count", "budget", "currency", "venue", "location", "status"]}
        counts = {k: len(snap.get(k) or []) for k in ["requirements", "timeline", "budget_lines", "vendors", "tasks", "guests", "risks"]}
        return "CURRENT EVENT STATE:\n" + json.dumps({"fields": scalars, "collections": counts}, ensure_ascii=False)

    def _skills_slice(self, manifests: list[dict[str, Any]]) -> str:
        lines = [f"- {m['name']}: {m['description']}" for m in manifests]
        return "AVAILABLE SKILLS (this state):\n" + "\n".join(lines)

    def _memory_slice(self, memory: dict[str, Any]) -> str:
        if not memory or not any(memory.values()):
            return ""
        return "RELEVANT MEMORY:\n" + json.dumps(memory, ensure_ascii=False)

    def _conversation(self, turns: list[Any]) -> list[Message]:
        recent = turns[-self.conversation_window :]
        return [Message(role=t.role, content=t.content) for t in recent]

    # -- purpose-specific builders ------------------------------------------
    def _base_system(self, task: str, event: StructuredEvent, manifests: list[dict], memory: dict, *, directives: dict[str, str] | None = None) -> Message:
        parts = [f"AGENT_TASK: {task}", GLOBAL_SYSTEM, f"WORKFLOW STATE: {event.status.value}", self._event_slice(event)]
        if manifests:
            parts.append(self._skills_slice(manifests))
        mem = self._memory_slice(memory)
        if mem:
            parts.append(mem)
        for key, value in (directives or {}).items():
            parts.append(f"{key}: {value}")
        return Message(role="system", content="\n\n".join(parts))

    def for_intent(self, *, event: StructuredEvent, manifests: list[dict], memory: dict, turns: list[Any], user_text: str) -> list[Message]:
        system = self._base_system(
            "intent", event, manifests, memory,
            directives={"INSTRUCTION": "Classify the user's intent and extract any event fields they provided."},
        )
        return [system, *self._conversation(turns), Message(role="user", content=user_text)]

    def for_clarify(self, *, event: StructuredEvent, memory: dict, turns: list[Any], field: str) -> list[Message]:
        system = self._base_system(
            "clarify", event, [], memory,
            directives={"CLARIFY_FIELD": field, "INSTRUCTION": f"Ask the user one natural, friendly question to obtain: {field}. One sentence."},
        )
        return [system, *self._conversation(turns)]

    def for_response(self, *, event: StructuredEvent, memory: dict, turns: list[Any], fallback_body: str) -> list[Message]:
        system = self._base_system(
            "respond", event, [], memory,
            directives={"RESPONSE_BODY": fallback_body, "INSTRUCTION": "Present the results to the user clearly. You may refine RESPONSE_BODY but keep every fact identical."},
        )
        return [system, *self._conversation(turns)]

    def for_summary(self, *, event: StructuredEvent, memory: dict, turns: list[Any], fallback_body: str) -> list[Message]:
        system = self._base_system(
            "summary", event, [], memory,
            directives={"SUMMARY_BODY": fallback_body, "INSTRUCTION": "Give a crisp planning summary / executive brief."},
        )
        return [system, *self._conversation(turns)]
