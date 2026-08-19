# Orchestration — AI Agent Integration

The **only** place the `agent/` package is wired into Django. `agent/` has no
Django imports; this app implements its abstract ports against the ORM, persists
conversation and run state, and exposes an async Conversation API. Anything that
looks like it needs a Django import inside `agent/` is an adapter concern and
belongs here.

## Architecture

```
POST /events/{id}/agent/messages ──▶ 202 {run_id}
                                      │ Celery: run_agent_turn  (queue: interactive)
                                      ▼
                       build_runtime(org, user)  ← frozen AgentRuntime, all DI
                         DjangoEventStateStore (hybrid: planning tables + sidecar)
                         8 service adapters (marketplace + OSM discovery)
                         DjangoKeyValueMemoryStore · PolicyEngine(org.settings)
                       rehydrate turns + _pending → handle_message()
                       persist AgentRun/Step, AgentTurn, state, ApprovalChain, outbox
GET  /events/{id}/agent/runs/{run_id} ──┘  (poll status/steps/result)
```

## Endpoints (all event-scoped, JWT auth)

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/v1/events/{event_id}/agent/sessions` | Open a conversation session |
| POST | `/api/v1/events/{event_id}/agent/messages` | Send a turn → `202 {run_id, session_id}` |
| GET | `/api/v1/events/{event_id}/agent/runs/{run_id}` | Poll a run (status, message, plan, steps) |
| GET | `/api/v1/events/{event_id}/agent/sessions/{sid}/messages` | Transcript |
| POST | `/api/v1/events/{event_id}/agent/sessions/{sid}/approve` | Approve gated actions → executes them |
| GET | `/api/v1/events/{event_id}/agent/state` | Current structured-event snapshot |
| POST | `/api/v1/events/{event_id}/agent/plan/approve` | Approve the plan and advance the workflow |
| GET | `/api/v1/events/{event_id}/agent/vendors` | AI vendor shortlist joined with marketplace data |
| POST | `/api/v1/events/{event_id}/agent/shortlist` | Persist the user's vendor selection (no outreach) |

`message` accepts an optional `session_id`; omit it to auto-open a session.
Outreach lives in the `procurement` app, not here.

## StructuredEvent ↔ ORM mapping

`DjangoEventStateStore` is a hybrid: canonical fields go to the real planning
tables, agent-only collections to the `AgentEventState` sidecar.

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

`AgentMemory` backs the agent's key-value memory store under three scopes:
`org:<uuid>`, `user:<uuid>`, and `plan:<event_id>` (the per-skill execution
record the workflow engine replays instead of re-running the DAG).

## Ephemeral state, rehydrated per turn

The agent keeps two things in-process; because every turn runs in a fresh worker
process, `run_agent_turn` restores both first, through public APIs:

1. **Conversation memory** — replay persisted `AgentTurn`s via `memory.add_turn(...)`.
2. **Pending approvals** — restore `runtime._pending[session_id]` from
   `AgentSession.pending_approvals` so an `approve` turn can execute the gated skills.

## Run it

```bash
# 1. infra: Postgres + Redis + queue workers
cd infra && docker compose --profile worker up -d      # db, redis, worker-interactive, worker-outbox, ...

# 2. migrate + seed + (optionally) discover local suppliers
python manage.py migrate
python manage.py seed_marketplace
python manage.py discover_vendors --location "Kathmandu"

# 3. run the API
python manage.py runserver
```

Set the LLM provider in `.env` (`AGENT_LLM_PROVIDER=ollama|openai|anthropic|gemini`).

### Local dev without Redis
Set `CELERY_TASK_ALWAYS_EAGER=true` — turns then run inline in the web process
(no worker needed). Deliver outbox events with `python manage.py dispatch_outbox`.

## Example

```bash
EVT=<event-uuid>; TOK=<jwt>
curl -sX POST localhost:8000/api/v1/events/$EVT/agent/messages \
  -H "Authorization: Bearer $TOK" -H "Content-Type: application/json" \
  -d '{"message":"Plan a 200-person conference on 2026-09-15 in Kathmandu, budget 5000000, call it DevWeek"}'
# → {"run_id":"...","session_id":"...","status":"queued"}
curl -s localhost:8000/api/v1/events/$EVT/agent/runs/<run_id> -H "Authorization: Bearer $TOK"
# → {"status":"completed","ai_state":"review","message":"...","steps":[...]}
```

## Supplier discovery
Venue/vendor ports query the `marketplace` app and, when `AGENT_DISCOVERY_ENABLED`
(default on), augment it with live **OpenStreetMap** results near the event
location (Nominatim + Overpass), persisted into `marketplace.Vendor` and cached.
Talent/sponsor are mapped to vendor categories where possible; true
talent/sponsor discovery is deferred. See `orchestration/discovery/`.

Known cost: this runs **inline in the turn**, so a user's message blocks on two
public endpoints. It belongs in its own task keyed on location+category — the
`VendorDiscoveryLog` TTL cache already makes that safe.

## Tests
```bash
python manage.py test orchestration --settings=config.settings.test
```
Uses a deterministic `FakeLLM` (offline) and eager Celery. `TransactionTestCase`
+ serialized skills accommodate SQLite; production runs on Postgres with full
concurrency.
