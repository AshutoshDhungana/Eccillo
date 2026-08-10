# Orchestration — AI Agent Integration (Phase 3)

Wires the **frozen** `agent/` package into Django. The agent is never modified;
this app implements its interfaces (`contracts.md`) and exposes an async
Conversation API.

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

`message` accepts an optional `session_id`; omit it to auto-open a session.

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

## Tests
```bash
python manage.py test orchestration --settings=config.settings.test
```
Uses a deterministic `FakeLLM` (offline) and eager Celery. `TransactionTestCase`
+ serialized skills accommodate SQLite; production runs on Postgres with full
concurrency.
