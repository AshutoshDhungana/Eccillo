"""Capability registry (spec §Tool Registry).

Skills register themselves here; the orchestrator discovers capabilities
dynamically instead of hard-coding them.  The registry can also filter the
catalogue down to what is *available* in the current event state, which feeds
both the policy engine and the composed prompt.
"""

from __future__ import annotations

from ..errors import CapabilityNotFound
from ..skills.base import Skill
from ..state import EventState


class CapabilityRegistry:
    def __init__(self) -> None:
        self._skills: dict[str, Skill] = {}

    def register(self, skill: Skill) -> None:
        if skill.name in self._skills:
            raise ValueError(f"Duplicate skill name: {skill.name}")
        self._skills[skill.name] = skill

    def register_all(self, skills: list[Skill]) -> None:
        for skill in skills:
            self.register(skill)

    def get(self, name: str) -> Skill:
        try:
            return self._skills[name]
        except KeyError as exc:
            raise CapabilityNotFound(f"No skill named '{name}' is registered.") from exc

    def has(self, name: str) -> bool:
        return name in self._skills

    def all(self) -> list[Skill]:
        return list(self._skills.values())

    def available_in(self, state: EventState) -> list[Skill]:
        """Skills whose ``allowed_states`` permit the given state."""
        return [s for s in self._skills.values() if s.allowed_states is None or state in s.allowed_states]

    def manifests(self, state: EventState | None = None) -> list[dict]:
        skills = self.available_in(state) if state is not None else self.all()
        return [s.manifest() for s in skills]
