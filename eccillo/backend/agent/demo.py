"""End-to-end, runnable demonstration of the agent layer.

Run it from the backend directory with a configured provider::

    $env:AGENT_LLM_PROVIDER="openai"; $env:OPENAI_API_KEY="sk-..."; python -m agent.demo
    # or fully local, no key:
    $env:AGENT_LLM_PROVIDER="ollama"; python -m agent.demo
"""

from __future__ import annotations

import asyncio
import json
import sys

from .conversation import ConversationEngine
from .env import load_env
from .errors import ProviderNotConfigured
from .llm import available_providers

load_env()  # pick up AGENT_LLM_PROVIDER / provider keys from the project .env

# Windows terminals default to cp1252; the plan uses unicode (≥, ⚠, ·).
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")


def _banner(title: str) -> None:
    print("\n" + "=" * 72)
    print(title)
    print("=" * 72)


def _show(turn: str, resp) -> None:
    print(f"\n>>> USER: {turn}")
    print(f"<<< AGENT ({resp.state}) [intent={resp.intent}]:")
    print(resp.message)
    if resp.clarifying:
        print(f"    · still missing: {resp.missing_fields}")
    if resp.explanation:
        print("    · reasoning:")
        for line in resp.explanation[:8]:
            print(f"        - {line}")
    if resp.pending_approvals:
        print(f"    · pending approvals: {[a['skill'] for a in resp.pending_approvals]}")


async def main() -> None:
    try:
        engine = ConversationEngine()
    except ProviderNotConfigured as exc:
        print(f"LLM provider not configured: {exc.message}")
        print(f"Available: {', '.join(available_providers())}. "
              'Set AGENT_LLM_PROVIDER + the matching key, or use "ollama" locally.')
        return
    print(f"Provider: {engine.runtime.llm.provider} · model: {engine.runtime.llm.model}")

    # Seed some organization/user memory to show the memory tiers in action.
    engine.runtime.memory.remember_org("org-1", {"standing_requirements": ["livestream"], "preferred_vendors": ["StageCraft AV"]})
    engine.runtime.memory.remember_user("user-1", {"writing_style": "energetic and concise"})

    session = engine.start_session(organization_id="org-1", user_id="user-1")
    _banner(f"Session {session.session_id[:8]} · event {session.event_id[:8]}")

    script = [
        "I want to plan a tech conference",              # intent + type, still missing info
        "About 200 guests",                               # provide guest_count
        "On 2026-09-15 in Kathmandu",                     # provide date + location
        "Call it DevWeek 2026 with a budget of 5000000",  # title + budget → triggers full plan
        "Give me a status summary",                       # summary
        "Draft the invitation email",                     # reaches an approval gate
        "approve",                                        # execute approved action
    ]

    for turn in script:
        resp = await engine.send(session.session_id, turn)
        _show(turn, resp)

    _banner("FINAL STRUCTURED EVENT STATE")
    print(json.dumps(engine.event(session.session_id).snapshot(), indent=2, ensure_ascii=False))

    _banner("OBSERVABILITY (last turn)")
    print(json.dumps(resp.observability, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    asyncio.run(main())
