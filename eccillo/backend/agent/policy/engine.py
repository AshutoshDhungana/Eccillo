"""Policy engine (spec §Human Approval + state-gated actions).

The policy engine answers one question: *is this skill allowed to execute right
now, and if so, does it need human approval first?*  It combines three inputs:

* the skill's declared ``allowed_states`` and ``requires_approval``,
* the current event state,
* organization policy (from org memory) that can escalate extra skills to
  approval (e.g. "all vendor bookings need finance sign-off").
"""

from __future__ import annotations

import enum
from dataclasses import dataclass

from ..skills.base import Skill
from ..state import EventState


class Decision(str, enum.Enum):
    ALLOW = "allow"
    REQUIRE_APPROVAL = "require_approval"
    DENY = "deny"


@dataclass
class PolicyDecision:
    decision: Decision
    reason: str

    @property
    def allowed(self) -> bool:
        return self.decision == Decision.ALLOW

    @property
    def needs_approval(self) -> bool:
        return self.decision == Decision.REQUIRE_APPROVAL


# Irreversible/outbound skill names that always require approval regardless of
# their own declaration — a defensive backstop.
_ALWAYS_APPROVE = {"email"}


class PolicyEngine:
    def __init__(self, *, org_policy: dict | None = None):
        # e.g. {"approval_required_skills": ["vendor"], "auto_send_email": False}
        self.org_policy = org_policy or {}

    def evaluate(self, skill: Skill, state: EventState) -> PolicyDecision:
        if skill.allowed_states is not None and state not in skill.allowed_states:
            return PolicyDecision(
                Decision.DENY,
                f"'{skill.name}' is not available in state '{state.value}'.",
            )

        extra_approval = set(self.org_policy.get("approval_required_skills", []))
        if skill.requires_approval or skill.name in _ALWAYS_APPROVE or skill.name in extra_approval:
            return PolicyDecision(
                Decision.REQUIRE_APPROVAL,
                f"'{skill.name}' performs an irreversible or outbound action and needs approval.",
            )

        return PolicyDecision(Decision.ALLOW, "Permitted in the current state with no approval required.")
