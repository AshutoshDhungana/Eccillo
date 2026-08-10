"""Pluggable LLM providers for the agent layer.

Built-in providers: openai, anthropic, gemini, ollama (plus any
OpenAI-compatible server via OPENAI_BASE_URL). Register your own with
``register_provider``.
"""

from .base import LLMClient, LLMResponse, Message, StructuredResponse
from .factory import available_providers, build_llm, register_provider

__all__ = [
    "LLMClient",
    "LLMResponse",
    "Message",
    "StructuredResponse",
    "build_llm",
    "register_provider",
    "available_providers",
]
