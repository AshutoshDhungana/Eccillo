"""Skill framework (spec §Layer 3 & §Tool Registry).

A *skill* is a high-level, self-describing business capability.  Each skill
exposes a description, typed input/output schemas, validation, and an
``execute`` coroutine.  The orchestrator discovers skills through the registry
and never hard-codes them.

Skills read and update event state only through :class:`EventStateManager` and
reach real capabilities only through :class:`BackendServices` — they contain no
Django or transport code, which is what keeps this layer decoupled.
"""

from __future__ import annotations

import abc
from dataclasses import dataclass, field
from typing import Any

from pydantic import BaseModel, ValidationError as PydanticValidationError

from ..errors import AgentError, Outcome, ValidationError
from ..observability import Observer
from ..state import EventState, EventStateManager, StructuredEvent


@dataclass
class SkillContext:
    """Everything a skill is allowed to touch during one execution."""

    event_id: str
    state: EventStateManager
    memory: Any  # MemoryService (avoids an import cycle)
    llm: Any  # LLMClient
    backend: Any  # BackendServices
    observer: Observer
    organization_id: str | None = None
    user_id: str | None = None
    inputs: dict[str, Any] = field(default_factory=dict)

    def event(self) -> StructuredEvent:
        return self.state.get(self.event_id)


@dataclass
class SkillResult:
    """Normalized output of a skill run, including explainability metadata."""

    skill: str
    outcome: Outcome
    data: dict[str, Any] = field(default_factory=dict)
    # Human-facing reasoning for every material decision (spec §Explainability).
    explanation: list[str] = field(default_factory=list)
    error: str | None = None
    retryable: bool = False
    # Replayed from plan memory instead of executed this turn.
    cached: bool = False

    @property
    def ok(self) -> bool:
        return self.outcome.is_terminal_success

    def to_dict(self) -> dict[str, Any]:
        return {
            "skill": self.skill,
            "outcome": self.outcome.value,
            "data": self.data,
            "explanation": self.explanation,
            "error": self.error,
            "cached": self.cached,
        }


class Skill(abc.ABC):
    """Base class every capability inherits from."""

    name: str = "skill"
    description: str = ""
    version: str = "1.0"
    input_model: type[BaseModel] | None = None
    output_model: type[BaseModel] | None = None

    # StructuredEvent fields that must be non-empty before this skill can run.
    required_event_fields: list[str] = []
    # StructuredEvent collections/fields this skill writes (used for DAG deps).
    produces: list[str] = []
    # Every StructuredEvent field this skill's output depends on.  Defaults to
    # ``required_event_fields``; declare explicitly when a skill reads more than
    # it strictly requires.  Plan memory re-runs the skill when any of these
    # change, so a field left out here means stale cached output.  Never list a
    # field this skill also ``produces`` — that self-invalidates every turn.
    reads: list[str] = []
    # Irreversible/outbound skills require explicit human approval (spec §Human Approval).
    requires_approval: bool = False
    # None == available in any state; otherwise gated to these states.
    allowed_states: set[EventState] | None = None

    # -- discovery -----------------------------------------------------------
    @classmethod
    def input_schema(cls) -> dict[str, Any]:
        return cls.input_model.model_json_schema() if cls.input_model else {"type": "object", "properties": {}}

    @classmethod
    def output_schema(cls) -> dict[str, Any]:
        return cls.output_model.model_json_schema() if cls.output_model else {"type": "object", "properties": {}}

    @classmethod
    def input_fields(cls) -> list[str]:
        """Event fields whose value determines this skill's output."""
        return cls.reads or cls.required_event_fields

    @classmethod
    def manifest(cls) -> dict[str, Any]:
        """Machine-readable description the registry advertises to the planner."""
        return {
            "name": cls.name,
            "description": cls.description,
            "version": cls.version,
            "required_event_fields": cls.required_event_fields,
            "produces": cls.produces,
            "requires_approval": cls.requires_approval,
            "input_schema": cls.input_schema(),
        }

    # -- execution wrapper ---------------------------------------------------
    async def run(self, ctx: SkillContext, payload: dict[str, Any] | None = None) -> SkillResult:
        """Validate, execute, and normalize the outcome. Never raises."""
        payload = payload or {}
        try:
            self._check_required_fields(ctx)
            model = self._validate_input(payload)
            data, explanation = await self.execute(ctx, model)
            self._validate_output(data)
            return SkillResult(name_or(self), Outcome.SUCCESS, data=data, explanation=explanation)
        except AgentError as exc:
            return SkillResult(self.name, exc.outcome, error=exc.message, retryable=exc.outcome == Outcome.RETRYABLE_ERROR, data=exc.details)
        except PydanticValidationError as exc:
            return SkillResult(self.name, Outcome.VALIDATION_ERROR, error=str(exc))
        except Exception as exc:  # noqa: BLE001 - defensive: never leak raw errors upward
            return SkillResult(self.name, Outcome.FAILURE, error=f"{type(exc).__name__}: {exc}")

    def _check_required_fields(self, ctx: SkillContext) -> None:
        event = ctx.event()
        missing = [f for f in self.required_event_fields if getattr(event, f, None) in (None, "", 0)]
        if missing:
            raise ValidationError(
                f"{self.name} is missing required event fields: {', '.join(missing)}",
                details={"missing": missing},
            )

    def _validate_input(self, payload: dict[str, Any]) -> BaseModel | dict[str, Any]:
        if self.input_model is None:
            return payload
        return self.input_model.model_validate(payload)

    def _validate_output(self, data: dict[str, Any]) -> None:
        if self.output_model is not None:
            self.output_model.model_validate(data)

    # -- to implement --------------------------------------------------------
    @abc.abstractmethod
    async def execute(self, ctx: SkillContext, payload: Any) -> tuple[dict[str, Any], list[str]]:
        """Do the work.  Return ``(data, explanation)``.

        ``data`` is the JSON-serializable result; ``explanation`` is a list of
        human-readable reasons for the decisions taken.
        """


def name_or(skill: Skill) -> str:
    return getattr(skill, "name", skill.__class__.__name__)
