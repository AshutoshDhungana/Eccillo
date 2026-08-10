"""Assemble a fully DB-backed AgentRuntime (Phase 3, Milestone 3).

The agent's async skills call synchronous Django ORM (via the adapters and the
state store).  A conversation turn runs in a background worker where blocking is
fine, so we enable ``DJANGO_ALLOW_ASYNC_UNSAFE`` — the documented switch for
"synchronous ORM inside an async context you control".
"""

from __future__ import annotations

import os

os.environ.setdefault("DJANGO_ALLOW_ASYNC_UNSAFE", "true")

from agent.config import load_config  # noqa: E402
from agent.llm import build_llm  # noqa: E402
from agent.memory import MemoryService  # noqa: E402
from agent.policy import PolicyEngine  # noqa: E402
from agent.runtime import AgentRuntime  # noqa: E402
from agent.state import EventStateManager  # noqa: E402

from .memory_store import DjangoKeyValueMemoryStore  # noqa: E402
from .services import build_backend_services  # noqa: E402
from .state_store import DjangoEventStateStore  # noqa: E402


def build_runtime(*, organization=None, user=None, llm=None, config=None, discover=True) -> AgentRuntime:
    """Construct an AgentRuntime wired entirely to Django-backed collaborators.

    ``llm`` may be injected (tests pass a FakeLLM); otherwise it is built from
    :class:`AgentConfig` (env/Django settings). ``discover`` toggles live
    OSM-backed venue/vendor discovery near the event location (falls back to
    curated marketplace data when off or offline). The agent package is
    untouched — everything here is dependency injection through its constructor.
    """
    config = config or load_config()
    store = DjangoEventStateStore()
    state = EventStateManager(store=store)
    memory = MemoryService(state, window=config.conversation_window, store=DjangoKeyValueMemoryStore())

    discovery = None
    if discover:
        from orchestration.discovery import VendorDiscoveryService

        discovery = VendorDiscoveryService()
    backend = build_backend_services(organization=organization, user=user, state_store=store, discovery=discovery)
    org_policy = {}
    if organization is not None:
        org_policy = (organization.settings or {}).get("agent_policy", {})
    policy = PolicyEngine(org_policy=org_policy)

    return AgentRuntime(
        config=config,
        state_manager=state,
        memory=memory,
        backend=backend,
        policy=policy,
        llm=llm or build_llm(config),
    )
