"""Eccillo Phase 2 — AI Orchestration & Automation (the Agent layer).

A standalone, backend-decoupled agent layer that turns Eccillo into an AI-native
event operating system.  The LLM reasons and communicates; the orchestrator
decides; backend-owned workflows and skills execute; the structured event state
is the single source of truth.

This package is intentionally NOT wired into the Django app yet.  It talks to
the platform only through the abstract ports in :mod:`agent.services`, which are
backed by an in-memory mock today and by the real Eccillo services in a later
integration phase.

Quick start::

    import asyncio
    from agent import ConversationEngine

    engine = ConversationEngine()
    session = engine.start_session()
    resp = asyncio.run(engine.send(session.session_id, "Plan a 200-person tech conference"))
    print(resp.message)

See ``agent/README.md`` and ``agent/demo.py`` for an end-to-end walkthrough.
"""

from .config import AgentConfig, load_config
from .conversation import ConversationEngine, Session
from .errors import Outcome
from .runtime import AgentResponse, AgentRuntime
from .state import EventState, StructuredEvent

__all__ = [
    "ConversationEngine",
    "Session",
    "AgentRuntime",
    "AgentResponse",
    "AgentConfig",
    "load_config",
    "EventState",
    "StructuredEvent",
    "Outcome",
]

__version__ = "0.1.0"
