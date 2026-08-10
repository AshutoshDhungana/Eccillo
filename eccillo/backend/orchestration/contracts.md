# Frozen Agent Contract (Phase 3)

The `backend/agent/` package is **frozen** — no code changes. The `orchestration`
app conforms to the interfaces below. If a requirement seems to need an agent
change, it is instead an adapter/persistence concern solved here.

## Injection points (`agent.runtime.AgentRuntime.__init__`)

Every collaborator is constructor-injected, so a fully DB-backed runtime is
assembled without touching agent code:

```python
AgentRuntime(
    config=AgentConfig(...),                 # from Django settings / env
    state_manager=EventStateManager(store=DjangoEventStateStore()),
    memory=MemoryService(state_manager, store=DjangoKeyValueMemoryStore()),
    backend=BackendServices(... 8 Django adapters ...),
    policy=PolicyEngine(org_policy=organization.settings.get("agent_policy", {})),
    llm=build_llm(config),                   # or an injected client
)
```

## Interfaces the backend must implement

| Agent interface | Methods (exact) |
|---|---|
| `agent.state.EventStateStore` | `get(event_id) -> StructuredEvent \| None`; `save(StructuredEvent) -> StructuredEvent`; `all() -> list[StructuredEvent]` |
| `agent.services.ports.VenueService` | `async search(*, event_type, guest_count, budget_minor, location, date) -> list[dict]` |
| `agent.services.ports.VendorService` | `async search(*, category, constraints) -> list[dict]` |
| `agent.services.ports.BudgetService` | `async benchmarks(*, event_type, guest_count) -> dict[str, float]` |
| `agent.services.ports.TimelineService` | `async template(*, event_type) -> list[dict]` |
| `agent.services.ports.WeatherService` | `async forecast(*, location, date) -> dict` |
| `agent.services.ports.CalendarService` | `async check_conflicts(*, organizer_id, date) -> list[dict]` |
| `agent.services.ports.EmailService` | `async draft(*, to, subject, body) -> dict` |
| `agent.services.ports.NotificationService` | `async enqueue(*, channel, template_key, payload) -> dict` |
| `agent.memory.KeyValueMemoryStore` | `get_all(scope) -> dict`; `set(scope, key, value)`; `update(scope, values)` |

## StructuredEvent ↔ ORM mapping (hybrid)

Canonical fields persist to the real planning tables via
`common.event_mutations.execute_event_mutation`; agent-only fields persist to the
`AgentEventState` sidecar.

| StructuredEvent | Backend home |
|---|---|
| `title, event_type, description, currency` | `planning.Event` |
| `date, end_date → starts_at, ends_at` | `planning.Event` |
| `guest_count → expected_attendees` | `planning.Event` |
| `budget → budget_target_minor` | `planning.Event` |
| `location, venue` | `planning.Event.location` (JSON) |
| `status` (EventState) | `planning.Event.status` via `agent.state.BACKEND_STATUS_MAP` |
| `timeline[]` | `planning.Milestone` |
| `tasks[]` | `planning.Task` |
| `budget_lines[]` | `planning.BudgetLineItem` |
| `risks[]` | `planning.Risk` |
| `requirements, vendors, guests, notes, timeline meta` | `orchestration.AgentEventState` (JSON sidecar) |

## Ephemeral runtime state (rehydrated per stateless request)

The agent keeps two things in-process; the Conversation API restores them before
each turn using **public** APIs / known attributes (no agent-code change):

1. **Conversation memory** — replay persisted `AgentTurn`s via `memory.add_turn(...)`.
2. **Pending approvals** — restore `runtime._pending[session_id]` from persisted
   approvals before an `approve` turn, so the gated skills execute.
