"""Runtime configuration for the agent layer.

The agent layer is intentionally decoupled from Django settings so it can run
standalone (tests, notebooks, a future worker process).  Everything is read
from the environment with conservative defaults, mirroring how the rest of the
backend reads config in ``config/settings/base.py``.

Provider selection is open-ended: ``openai``, ``anthropic``, ``gemini``, and
``ollama`` ship in the box, and any OpenAI-compatible server (vLLM, LM Studio,
OpenRouter, Together, …) works through the ``openai`` provider by setting
``OPENAI_BASE_URL``.  New providers can be registered at runtime via
``agent.llm.register_provider``.
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field

# Sensible default model per provider, used when AGENT_LLM_MODEL is unset.
DEFAULT_MODELS = {
    "openai": "gpt-4.1",
    "anthropic": "claude-sonnet-4-6",
    "gemini": "gemini-2.0-flash",
    "ollama": "llama3.1",
}


def _env(name: str, default: str) -> str:
    value = os.environ.get(name)
    return value if value not in (None, "") else default


def _env_int(name: str, default: int) -> int:
    try:
        return int(os.environ.get(name, default))
    except (TypeError, ValueError):
        return default


def _env_float(name: str, default: float) -> float:
    try:
        return float(os.environ.get(name, default))
    except (TypeError, ValueError):
        return default


@dataclass(frozen=True)
class AgentConfig:
    """Immutable configuration snapshot for a runtime instance."""

    # --- LLM provider ---
    # "openai" | "anthropic" | "gemini" | "ollama" | any registered provider.
    llm_provider: str = field(default_factory=lambda: _env("AGENT_LLM_PROVIDER", "openai"))
    # Empty means "use the provider's default model" (see DEFAULT_MODELS).
    llm_model: str = field(default_factory=lambda: _env("AGENT_LLM_MODEL", ""))
    llm_temperature: float = field(default_factory=lambda: _env_float("AGENT_LLM_TEMPERATURE", 0.2))
    llm_max_tokens: int = field(default_factory=lambda: _env_int("AGENT_LLM_MAX_TOKENS", 2048))
    llm_timeout_seconds: float = field(default_factory=lambda: _env_float("AGENT_LLM_TIMEOUT", 60.0))

    # --- Provider credentials / endpoints ---
    openai_api_key: str = field(default_factory=lambda: _env("OPENAI_API_KEY", ""))
    # Optional OpenAI-compatible base URL (vLLM, LM Studio, OpenRouter, …).
    openai_base_url: str = field(default_factory=lambda: _env("OPENAI_BASE_URL", ""))
    anthropic_api_key: str = field(default_factory=lambda: _env("ANTHROPIC_API_KEY", ""))
    # Gemini accepts either GEMINI_API_KEY or the more common GOOGLE_API_KEY.
    gemini_api_key: str = field(default_factory=lambda: _env("GEMINI_API_KEY", "") or _env("GOOGLE_API_KEY", ""))
    gemini_base_url: str = field(default_factory=lambda: _env("GEMINI_BASE_URL", "https://generativelanguage.googleapis.com"))
    # Ollama runs locally by default — no key required. Use 127.0.0.1 (IPv4) not
    # "localhost", which on Windows resolves to IPv6 ::1 and can reach a
    # *different* Ollama daemon (or none) than the one the CLI uses.
    ollama_base_url: str = field(default_factory=lambda: _env("OLLAMA_BASE_URL", "http://127.0.0.1:11434"))

    # --- Orchestration ---
    max_concurrency: int = field(default_factory=lambda: _env_int("AGENT_MAX_CONCURRENCY", 4))
    # Replay unchanged workflow steps from plan memory instead of re-running
    # them.  Kill switch for when a cached step is suspected of serving stale
    # output (set AGENT_PLAN_MEMORY=0).
    plan_memory: bool = field(default_factory=lambda: _env("AGENT_PLAN_MEMORY", "1").lower() not in {"0", "false", "no", "off"})
    max_skill_retries: int = field(default_factory=lambda: _env_int("AGENT_MAX_SKILL_RETRIES", 2))
    conversation_window: int = field(default_factory=lambda: _env_int("AGENT_CONVERSATION_WINDOW", 12))

    def model_for(self, provider: str) -> str:
        """Resolve the model id: explicit override, else the provider default."""
        return self.llm_model or DEFAULT_MODELS.get(provider, "")


def load_config() -> AgentConfig:
    """Load config from the environment (dotenv is loaded by the host process)."""
    return AgentConfig()
