"""Error taxonomy and execution outcomes for the agent layer.

The orchestrator never lets a raw exception reach the user.  Every skill run is
funnelled through this taxonomy so the orchestrator can decide the next action
(retry, escalate for approval, ask a clarifying question, or fail gracefully).
"""

from __future__ import annotations

import enum


class Outcome(str, enum.Enum):
    """Normalized result of a single tool/skill execution (see spec §Error Recovery)."""

    SUCCESS = "success"
    FAILURE = "failure"
    PARTIAL = "partial"
    VALIDATION_ERROR = "validation_error"
    PERMISSION_ERROR = "permission_error"
    RETRYABLE_ERROR = "retryable_error"
    NEEDS_APPROVAL = "needs_approval"

    @property
    def is_terminal_success(self) -> bool:
        return self in (Outcome.SUCCESS, Outcome.PARTIAL)


class AgentError(Exception):
    """Base class for every error raised inside the agent layer."""

    outcome: Outcome = Outcome.FAILURE

    def __init__(self, message: str, *, details: dict | None = None):
        super().__init__(message)
        self.message = message
        self.details = details or {}


class ValidationError(AgentError):
    """Skill input/output failed schema or business validation."""

    outcome = Outcome.VALIDATION_ERROR


class PermissionError(AgentError):  # noqa: A001 - deliberately shadows builtin within this package
    """The current actor/state is not allowed to run this capability."""

    outcome = Outcome.PERMISSION_ERROR


class RetryableError(AgentError):
    """A transient failure (timeout, rate limit, upstream 5xx) worth retrying."""

    outcome = Outcome.RETRYABLE_ERROR


class ApprovalRequired(AgentError):
    """An irreversible action was reached that needs explicit human approval."""

    outcome = Outcome.NEEDS_APPROVAL


class CapabilityNotFound(AgentError):
    """The orchestrator asked the registry for a skill that is not registered."""


class ProviderNotConfigured(AgentError):
    """The selected LLM provider is unknown or missing required configuration."""


class StateTransitionError(AgentError):
    """An illegal event-state transition was attempted."""


class PolicyViolation(PermissionError):
    """A policy rule rejected an action outright (distinct from needing approval)."""
