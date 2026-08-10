"""Provider registry and construction (spec §Guiding Principle 2).

Ships four providers — ``openai``, ``anthropic``, ``gemini``, ``ollama`` — and
an OpenAI-compatible escape hatch via ``OPENAI_BASE_URL``.  Extra providers can
be added at runtime::

    from agent.llm import register_provider, LLMClient

    class MyClient(LLMClient):
        provider = "myprovider"
        ...  # implement complete() and structured()

    register_provider("myprovider", lambda cfg: MyClient(model=cfg.model_for("myprovider")))

There is deliberately **no mock provider**: the layer always talks to a real
model.  For offline/on-prem use, run ``ollama`` locally (no API key required).
Tests inject their own lightweight double via ``AgentRuntime(llm=...)``.
"""

from __future__ import annotations

from collections.abc import Callable

from ..config import AgentConfig
from ..errors import ProviderNotConfigured
from .base import LLMClient

ProviderBuilder = Callable[[AgentConfig], LLMClient]


def _build_openai(config: AgentConfig) -> LLMClient:
    if not config.openai_api_key and not config.openai_base_url:
        raise ProviderNotConfigured(
            "OpenAI provider needs OPENAI_API_KEY (or OPENAI_BASE_URL for a local/compatible server).",
            details={"provider": "openai"},
        )
    from .openai_client import OpenAIClient

    return OpenAIClient(
        api_key=config.openai_api_key,
        base_url=config.openai_base_url or None,
        model=config.model_for("openai"),
        temperature=config.llm_temperature,
        max_tokens=config.llm_max_tokens,
        timeout=config.llm_timeout_seconds,
    )


def _build_anthropic(config: AgentConfig) -> LLMClient:
    if not config.anthropic_api_key:
        raise ProviderNotConfigured("Anthropic provider needs ANTHROPIC_API_KEY.", details={"provider": "anthropic"})
    from .anthropic_client import AnthropicClient

    return AnthropicClient(
        api_key=config.anthropic_api_key,
        model=config.model_for("anthropic"),
        temperature=config.llm_temperature,
        max_tokens=config.llm_max_tokens,
        timeout=config.llm_timeout_seconds,
    )


def _build_gemini(config: AgentConfig) -> LLMClient:
    if not config.gemini_api_key:
        raise ProviderNotConfigured("Gemini provider needs GEMINI_API_KEY (or GOOGLE_API_KEY).", details={"provider": "gemini"})
    from .gemini_client import GeminiClient

    return GeminiClient(
        api_key=config.gemini_api_key,
        base_url=config.gemini_base_url,
        model=config.model_for("gemini"),
        temperature=config.llm_temperature,
        max_tokens=config.llm_max_tokens,
        timeout=config.llm_timeout_seconds,
    )


def _build_ollama(config: AgentConfig) -> LLMClient:
    from .ollama_client import OllamaClient

    return OllamaClient(
        base_url=config.ollama_base_url,
        model=config.model_for("ollama"),
        temperature=config.llm_temperature,
        max_tokens=config.llm_max_tokens,
        timeout=config.llm_timeout_seconds,
    )


_PROVIDERS: dict[str, ProviderBuilder] = {
    "openai": _build_openai,
    "anthropic": _build_anthropic,
    "gemini": _build_gemini,
    "ollama": _build_ollama,
}


def register_provider(name: str, builder: ProviderBuilder) -> None:
    """Register (or override) a provider builder by name."""
    _PROVIDERS[name] = builder


def available_providers() -> list[str]:
    return sorted(_PROVIDERS)


def build_llm(config: AgentConfig) -> LLMClient:
    builder = _PROVIDERS.get(config.llm_provider)
    if builder is None:
        raise ProviderNotConfigured(
            f"Unknown LLM provider '{config.llm_provider}'. Available: {', '.join(available_providers())}.",
            details={"provider": config.llm_provider, "available": available_providers()},
        )
    return builder(config)
