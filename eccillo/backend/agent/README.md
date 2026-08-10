# Eccillo Agent Layer (Phase 2 — AI Orchestration)

A **standalone, backend-decoupled** agent layer that turns Eccillo into an
AI-native event operating system. The LLM *reasons and communicates*; the
orchestrator *decides*; backend-owned workflows and skills *execute*; the
structured event object is the *single source of truth*.

> This package is intentionally **not** wired into the Django app yet. It talks
> to the platform only through the abstract ports in `agent/services/ports.py`,
> backed by an in-memory mock today. Wiring those ports to the real services is
> the one remaining step — see [Integration](#integrating-with-the-real-backend).

---

## Architecture

```
User
  │
  ▼
Conversation API            conversation.py        (Layer 1 — no business logic)
  │
  ▼
Agent Runtime               runtime.py             (Layer 2 — the brain)
  │  reasoning + orchestration
  ├── Event State Manager   state/event_state.py   (structured event = source of truth)
  ├── Capability Registry   registry/capability.py (skills self-register, discovered dynamically)
  ├── Policy Engine         policy/engine.py        (state gating + human approval)
  └── Memory Service        memory/service.py       (conversation / event / org / user tiers)
  │
  ▼
Workflow Engine             workflow/engine.py      (execution queue: concurrent DAG + retries)
  │
  ▼
Workflows                   workflow/workflows.py   (timeline / budget / vendor / guest / logistics / full_plan / comms)
  │
  ▼
Skills                      skills/*.py             (Layer 3 — high-level capabilities)
  │
  ▼
Backend Service Ports       services/ports.py       (Layer 4 — the integration seam)
  │                         services/mock_backend.py (deterministic mock today)
  ▼
Existing Backend Services → PostgreSQL              (a later phase)
```

The LLM is reached only through the provider-agnostic contract in
`llm/base.py` (`complete` for prose, `structured` for schema-constrained JSON).

## Core design principles (from the Phase 2 brief)

| Principle | Where it lives |
|---|---|
| AI never owns state | `state/event_state.py` — all mutations go through `EventStateManager` |
| Reasoning ≠ execution | LLM produces intent/fields/wording; `WorkflowEngine` executes skills |
| Backend owns workflows | `workflow/workflows.py` declares DAGs; the AI only *selects* one |
| Modular capabilities | `skills/` — each skill is self-describing (schema, validate, execute) |
| Deterministic clarification | `clarification.py` — backend picks the field, LLM only phrases it |
| Layered, composed prompts | `prompts/builder.py` — global + state + skills + memory + recent turns |
| Error recovery | `errors.py` `Outcome` taxonomy; engine retries `RETRYABLE_ERROR`, blocks on dep failure |
| Explainability | every `SkillResult.explanation` carries human-readable reasons |
| Human approval | `policy/engine.py` gates irreversible/outbound actions (email, bookings…) |
| Observability | `observability.py` — spans, token usage, counters per turn |

## The state machine

`Draft → Collecting Information → Planning → Review → Approval → Booking →
Execution → Live → Completed → Archived` (`state/machine.py`). The current state
gates which skills are available, which the policy engine may run, and what the
prompt says. `BACKEND_STATUS_MAP` records the projection onto the existing
`planning.Event.status` column for the integration phase.

## Skills (Layer 3)

`planning`, `timeline`, `budget`, `tasks`, `venue`, `vendor`, `guest`,
`logistics`, `analytics`, `calendar`, `email` (approval-gated), `notification`.
Each declares `required_event_fields`, `produces`, `allowed_states`, and
`requires_approval`, and returns `(data, explanation)`.

## Run it

From `backend/` using the project venv:

```bash
# End-to-end demo (offline mock LLM if no API key is set)
python -m agent.demo

# Tests (stdlib unittest — no pytest / no database needed)
python -m unittest agent.tests.test_agent -v
```

## LLM providers

The layer talks only to real models through a provider-agnostic contract
(`llm/base.py`). Built-in providers:

| Provider | Setup | Structured output | Notes |
|---|---|---|---|
| `openai` | `OPENAI_API_KEY` | JSON-schema strict | Also any OpenAI-compatible server via `OPENAI_BASE_URL` (vLLM, LM Studio, OpenRouter, Groq…) |
| `anthropic` | `ANTHROPIC_API_KEY` | forced tool call | Claude |
| `gemini` | `GEMINI_API_KEY` / `GOOGLE_API_KEY` | `responseSchema` | REST via httpx, no SDK |
| `ollama` | run `ollama serve` | `format` schema | **local / offline, no key** |

Add your own without touching the core:

```python
from agent.llm import register_provider, LLMClient

class MyClient(LLMClient):
    provider = "myprovider"
    async def complete(self, messages, *, temperature=None): ...
    async def structured(self, messages, *, schema, schema_name="response"): ...

register_provider("myprovider", lambda cfg: MyClient(model=cfg.model_for("myprovider")))
```

There is **no mock provider** — for offline/on-prem use run `ollama`. Tests
inject a local `FakeLLM` double (`agent/tests/fakes.py`) via `AgentRuntime(llm=…)`.

## Configuration

All via environment (see `AgentConfig` in `config.py`):

| Var | Default | Notes |
|---|---|---|
| `AGENT_LLM_PROVIDER` | `openai` | `openai` \| `anthropic` \| `gemini` \| `ollama` \| custom |
| `AGENT_LLM_MODEL` | per-provider | override; default resolves from `DEFAULT_MODELS` |
| `OPENAI_API_KEY` / `OPENAI_BASE_URL` | — | key, or base URL for compatible servers |
| `ANTHROPIC_API_KEY` | — | Anthropic |
| `GEMINI_API_KEY` / `GOOGLE_API_KEY` | — | Gemini |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama daemon |
| `AGENT_LLM_TEMPERATURE` | `0.2` | |
| `AGENT_MAX_CONCURRENCY` | `4` | concurrent skills per execution queue |
| `AGENT_MAX_SKILL_RETRIES` | `2` | retries for `RETRYABLE_ERROR` |
| `AGENT_CONVERSATION_WINDOW` | `12` | recent turns kept in the prompt |

If the selected provider is missing its credential, construction raises a clear
`ProviderNotConfigured` error (the demo/REPL print setup instructions).

## Extending

- **Add a skill:** subclass `agent.skills.base.Skill`, implement `execute`, add
  it in `skills/__init__.py:default_skills()`. The registry, planner, policy,
  and prompt all pick it up automatically.
- **Add a workflow:** add a builder in `workflow/workflows.py` and route to it
  from `select_workflow`.
- **Add an LLM provider:** implement `agent.llm.base.LLMClient` and call
  `agent.llm.register_provider(name, builder)` (see [LLM providers](#llm-providers)).

## Integrating with the real backend

Nothing above changes. Reimplement the eight ports in `services/ports.py`
against the real services and swap the mock in one place:

```python
from agent import AgentRuntime
runtime = AgentRuntime(backend=my_real_backend_services)
```

Then replace the in-memory `EventStateStore` with an ORM-backed store that reads
and writes `planning.Event` and its children (`Milestone`, `Task`,
`BudgetLineItem`, `Risk`) — ideally through the existing
`common.event_mutations.execute_event_mutation` boundary so the AI inherits the
platform's locking, idempotency, revisioning, and outbox guarantees.
```
