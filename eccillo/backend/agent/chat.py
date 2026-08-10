"""Interactive REPL for hand-testing the agent layer.

Run from the ``backend`` directory with a configured provider::

    # OpenAI
    $env:AGENT_LLM_PROVIDER="openai"; $env:OPENAI_API_KEY="sk-..."; python -m agent.chat

    # Anthropic / Gemini
    $env:AGENT_LLM_PROVIDER="anthropic"; $env:ANTHROPIC_API_KEY="..."; python -m agent.chat
    $env:AGENT_LLM_PROVIDER="gemini"; $env:GEMINI_API_KEY="..."; python -m agent.chat

    # Ollama (fully local / offline — no API key; just `ollama serve`)
    $env:AGENT_LLM_PROVIDER="ollama"; python -m agent.chat

Just type messages and press Enter to talk to the planner. Slash-commands let
you inspect what the orchestrator is doing under the hood:

    /state     current workflow state + missing core fields
    /event     dump the full structured event JSON (the source of truth)
    /obs       observability for the last turn (spans, tokens, counters)
    /skills    list registered skills and the states they're available in
    /plan      show the plan/results from the last turn
    /new [type]  start a fresh session/event (optional event type)
    /help      show these commands
    /quit      exit
"""

from __future__ import annotations

import asyncio
import json
import sys

from .conversation import ConversationEngine
from .env import load_env
from .errors import ProviderNotConfigured
from .llm import available_providers
from .runtime import AgentResponse

# Load the project .env so AGENT_LLM_PROVIDER / provider keys are picked up.
load_env()

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")


BANNER = r"""
  Eccillo Agent — interactive test console
  Provider: {provider} · model: {model}
  Type a message, or /help for commands.  Try:  Plan a 200-person tech conference
"""


def _print_response(resp: AgentResponse) -> None:
    print(f"\n\033[36mAGENT\033[0m [{resp.state}] (intent={resp.intent})")
    print(resp.message)
    if resp.clarifying and resp.missing_fields:
        print(f"  · still missing: {', '.join(resp.missing_fields)}")
    if resp.explanation:
        print("  · reasoning:")
        for line in resp.explanation[:10]:
            print(f"      - {line}")
    if resp.pending_approvals:
        skills = ", ".join(a["skill"] for a in resp.pending_approvals)
        print(f"  · \033[33mneeds approval\033[0m: {skills}  (type 'approve' to proceed)")


def _print_help() -> None:
    print("""
Commands:
  /state         current state + missing fields
  /event         dump structured event JSON
  /obs           last-turn observability (spans, tokens)
  /skills        list registered skills
  /plan          last-turn plan + per-skill results
  /new [type]    start a fresh session (optional event type)
  /help          this help
  /quit          exit
""")


def _print_setup_help(exc: ProviderNotConfigured) -> None:
    print(f"\n\033[31mLLM provider not configured:\033[0m {exc.message}")
    print(f"  Available providers: {', '.join(available_providers())}")
    print("  Configure one, e.g. (PowerShell):")
    print('    $env:AGENT_LLM_PROVIDER="openai";   $env:OPENAI_API_KEY="sk-..."')
    print('    $env:AGENT_LLM_PROVIDER="anthropic"; $env:ANTHROPIC_API_KEY="..."')
    print('    $env:AGENT_LLM_PROVIDER="gemini";    $env:GEMINI_API_KEY="..."')
    print('    $env:AGENT_LLM_PROVIDER="ollama"     # local, no key (run: ollama serve)')


async def main() -> None:
    try:
        engine = ConversationEngine()
    except ProviderNotConfigured as exc:
        _print_setup_help(exc)
        return

    # A little seeded memory so org/user tiers are visible while testing.
    engine.runtime.memory.remember_org("org-1", {"standing_requirements": ["livestream"], "preferred_vendors": ["StageCraft AV"]})
    engine.runtime.memory.remember_user("user-1", {"writing_style": "warm and concise"})

    session = engine.start_session(organization_id="org-1", user_id="user-1")
    print(BANNER.format(provider=engine.runtime.llm.provider, model=engine.runtime.llm.model))
    print(f"  session {session.session_id[:8]} · event {session.event_id[:8]}\n")

    last: AgentResponse | None = None

    while True:
        try:
            text = input("\033[32myou>\033[0m ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nbye 👋")
            return
        if not text:
            continue

        # -- slash commands --------------------------------------------------
        if text in ("/quit", "/exit"):
            print("bye 👋")
            return
        if text == "/help":
            _print_help()
            continue
        if text == "/state":
            ev = engine.event(session.session_id)
            print(f"  state = {ev.status.value}")
            print(f"  missing core fields = {ev.missing_core_fields() or 'none'}")
            continue
        if text == "/event":
            print(json.dumps(engine.event(session.session_id).snapshot(), indent=2, ensure_ascii=False))
            continue
        if text == "/obs":
            print(json.dumps(last.observability, indent=2) if last else "  (no turn yet)")
            continue
        if text == "/plan":
            if not last:
                print("  (no turn yet)")
            else:
                print(json.dumps({"plan": last.plan, "results": last.results}, indent=2, ensure_ascii=False))
            continue
        if text == "/skills":
            for s in engine.runtime.registry.all():
                states = "any" if s.allowed_states is None else ", ".join(sorted(x.value for x in s.allowed_states))
                gate = " [approval]" if s.requires_approval else ""
                print(f"  - {s.name:<13}{gate:<11} states: {states}")
            continue
        if text.startswith("/new"):
            parts = text.split()
            et = parts[1] if len(parts) > 1 else None
            session = engine.start_session(organization_id="org-1", user_id="user-1", **({"event_type": et} if et else {}))
            last = None
            print(f"  started new session {session.session_id[:8]} · event {session.event_id[:8]}")
            continue

        # -- normal turn -----------------------------------------------------
        try:
            last = await engine.send(session.session_id, text)
            _print_response(last)
        except Exception as exc:  # noqa: BLE001 - keep the REPL alive
            print(f"  \033[31merror\033[0m: {type(exc).__name__}: {exc}")


if __name__ == "__main__":
    asyncio.run(main())
