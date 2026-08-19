# Eccillo Backend — Architecture

How the backend actually works, for someone who has never opened this repo.
Read this once top to bottom; after that use it as a map.

Related docs, deliberately not duplicated here:

- [`../SYSTEM_BRIEF.md`](../SYSTEM_BRIEF.md) — what is built vs. not built, and the known gaps.
- [`agent/README.md`](agent/README.md) — the AI layer's internals (skills, workflows, providers).
- [`orchestration/README.md`](orchestration/README.md) — the agent↔Django seam and endpoint list.

---

## 1. The stack in one breath

Django 5 + Django REST Framework, PostgreSQL, Celery on Redis. Views are
function-based (`@api_view`), not viewsets. Auth is a hand-rolled HMAC JWT
(`common/auth.py`), not `djangorestframework-simplejwt`. The AI layer is plain
Python with **zero Django imports**, reached through ports and adapters.

Everything is served under `/api/v1/` (`config/urls.py`), plus Django admin at
`/admin/`.

```bash
make install          # venv + npm
make up               # Postgres + Redis in docker
make migrate && make seed
make api              # runserver on :8000
```

Dev runs Celery **eagerly** (tasks execute inline in the web process) — see
`config/settings/dev.py`. You only need `make worker` if you set
`CELERY_TASK_ALWAYS_EAGER=false`.

---

## 2. The seven apps and which way dependencies point

| App | Owns | Depends on |
|---|---|---|
| `accounts` | `Organization`, `User`, `Membership`, `PermissionGrant` — the multi-tenant root | — |
| `common` | JWT auth, permissions, the mutation boundary, outbox, approvals, notifications, vendor scoring | `accounts`, `planning` (lazily) |
| `planning` | The canonical domain: `Event` + `Milestone`/`Task`/`BudgetLineItem`/`Risk`/`SeatingPlan`/`EventComment` | `accounts`, `common` |
| `marketplace` | `Vendor`, `ServiceListing`, `AvailabilityHold`, `EventVendorShortlist`, `Review`, `VendorDiscoveryLog`. Data + services only — **no views, no URLs mounted** | `common`, `accounts`, `planning` |
| `procurement` | `ProcurementRequest`, `Outreach` — quotes out, leads back | `common`, `marketplace`, `planning` |
| `agent` | The whole AI layer. Pure Python | **nothing** |
| `orchestration` | Django adapters for the agent's ports, the Celery turn task, the Conversation API, OSM discovery | everything |

The load-bearing rule: **`agent/` never imports Django.** If something inside
`agent/` looks like it needs the ORM, it is an adapter concern and belongs in
`orchestration/`.

---

## 3. Lifecycle of an authenticated request

Take `PATCH /api/v1/events/{id}/tasks/{task_id}`:

```
HTTP request
  │
  ▼ DRF DEFAULT_AUTHENTICATION_CLASSES
EccilloJWTAuthentication              common/auth.py
  · verify HS256 signature over SECRET_KEY, check exp, require type == "access"
  · load User (is_active) and Membership (status="active") named in the token
  · attach request.organization and request.membership   ← org scoping starts here
  │
  ▼ @permission_classes([IsAuthenticated])
  │
  ▼ accessible_event(request, event_id, write=True)      common/permissions.py
  · event must belong to request.organization
  · read  → any active member
  · write → role in {owner, admin, manager}, else an explicit PermissionGrant
  · returns None → the view returns 403
  │
  ▼ serializer validate → ORM write (or a service, see §4)
  │
  ▼ Response
  · errors are reshaped to RFC-7807 by common.api.problem_exception_handler
    (application/problem+json)
```

**The organization is never read from the request body or a query param.** It
comes from the membership baked into the token, which is why "switch
organization" (`POST /auth/switch-organization`) mints a *new* token rather than
setting a session value.

`request.organization` therefore only exists on JWT-authenticated requests. The
two public endpoints (`GET /events/slug/{slug}`, `POST /procurement/respond/{token}`)
have no organization and must find it themselves — see §7.

---

## 4. The write path: `execute_event_mutation`

Cross-app writes that change an event workspace do **not** just call
`Model.objects.create()`. They go through `common/event_mutations.py`, which
gives four guarantees in a single transaction:

```
execute_event_mutation(event, organization, actor, event_type, mutation, …)
  │
  ├ SELECT … FOR UPDATE on planning.Event   → writes for one event serialize
  ├ expected_revision mismatch              → 412 EventRevisionConflict
  ├ idempotency_key already used            → replay the stored result, don't re-run
  │                                           (mismatched payload → 409)
  ├ run your mutation(locked_event)         → returns a JSON-able dict
  ├ Event.revision += 1                     → optimistic-concurrency token
  └ emit(event_type, …)                     → durable DomainEvent row, same transaction
```

Idempotency is stored **on the outbox row** (`DomainEvent.dedupe_key`), not in a
side table, so a replay and its audit fact can never disagree. `dedupe_key` is
unique per *organization*, so every producer namespaces its own keys —
`procurement.send:{request_id}`, etc.

Current callers: `procurement/services.py` (create + send) and
`marketplace/services.py` (review). Plain `planning/views.py` CRUD still writes
directly through serializers and relies on `Event.save()` bumping `revision`.

> `common/api.py` also has `idempotent(request, handler)`, an HTTP-header
> (`Idempotency-Key`) variant backed by `IdempotencyRecord`. Nothing calls it
> today. Likewise `EccilloCursorPagination` is set as `DEFAULT_PAGINATION_CLASS`
> but no view uses it — every list endpoint is a function view returning a plain
> `Response`, so **list responses are unpaginated arrays**. Don't assume otherwise.

---

## 5. Async: the transactional outbox and Celery

Two queues, both isolated (`CELERY_TASK_ROUTES` in `config/settings/base.py`):

| Queue | Tasks |
|---|---|
| `interactive` | `orchestration.run_agent_turn` — one conversation turn |
| `outbox` | `orchestration.dispatch_outbox`, `procurement.send_outreach_batch` |

Nothing consumes the default `celery` queue, so an **unrouted task is enqueued
and never picked up**. Route new tasks explicitly.

The outbox pattern (`common/api.py:emit`):

1. The producer writes its domain change and a `DomainEvent` row in the *same*
   `transaction.atomic()` block. A rolled-back write cannot leak an event.
2. Delivery is requested only via `transaction.on_commit`, and dispatched **by
   name** (`celery_app.send_task("orchestration.dispatch_outbox")`) so `common`
   stays decoupled from `orchestration`.
3. A broker failure is swallowed on purpose. The `pending` row is durable; the
   next worker sweep or `python manage.py dispatch_outbox` recovers it.

`dispatch_outbox` currently just flips `pending → delivered` — there are no
external consumers yet. The status/attempt/lease columns on `DomainEvent` exist
so real consumers slot in without a schema change.

---

## 6. The AI layer — ports, adapters, and one turn

### The seam

```
agent/  (pure Python)                  orchestration/  (Django)
────────────────────────               ─────────────────────────
services/ports.py       ◄── implements ── adapters/services.py   (8 ports)
state/EventStateStore   ◄── implements ── adapters/state_store.py
memory/KeyValueStore    ◄── implements ── adapters/memory_store.py
AgentRuntime(...)       ◄── injected by ── adapters/runtime.py:build_runtime()
```

The eight ports are `venues, vendors, budgets, timelines, weather, calendar,
email, notifications`. Skills only ever see these. That is why the entire agent
runs under `python -m agent.demo` and `python -m unittest agent.tests.test_agent`
with no database.

### One conversation turn

```
POST /events/{id}/agent/messages
  → create AgentRun(status="queued"), run_agent_turn.delay(run_id)
  → 202 {run_id, session_id}                        ← client polls, no streaming

Celery worker (queue: interactive):
  build_runtime(org, user)                          full DI, per-turn
  rehydrate:  AgentTurn rows → memory.add_turn()
              AgentSession.pending_approvals → runtime._pending[sid]
  runtime.handle_message():
      1. LLM structured call → intent + extracted fields   (the LLM advises)
      2. state.apply_fields()                              (the state manager decides)
      3. missing core info? → next_clarification() picks the field,
         the LLM only phrases the question → return, no execution
      4. select_workflow(event, intent)  ← a short if-chain over hardcoded DAGs
      5. WorkflowEngine.execute(plan)    ← concurrent waves, retries,
                                           policy gate per skill
      6. advance the state machine, LLM composes the prose reply
  persist: AgentTurn ×2, AgentRun, AgentRunStep ×n, session.pending_approvals,
           ApprovalChain (if gated), DomainEvent "agent.turn.completed"

GET /events/{id}/agent/runs/{run_id}   → status, message, plan, steps
```

Every turn runs in a fresh process, so **all in-process agent state is rehydrated
from the DB first** through public APIs — that is the only reason the stateless
HTTP layer maps onto the runtime without changing the agent.

Skills are async but call the synchronous ORM through the adapters. A turn runs
in a worker where blocking is fine, so `DJANGO_ALLOW_ASYNC_UNSAFE=true` is set in
`orchestration/tasks.py` and `adapters/runtime.py`.

### Where state lives (hybrid store)

`DjangoEventStateStore` splits the agent's `StructuredEvent`:

- **Canonical** → real planning tables (`Event`, `Milestone`, `Task`,
  `BudgetLineItem`, `Risk`). The agent only manages rows with `source="ai"`;
  `user` and `template` rows are preserved.
- **Agent-only** (requirements, vendors, guests, notes, timeline meta, the
  fine-grained `ai_status`) → the `orchestration.AgentEventState` sidecar, plus a
  denormalized `snapshot` cache.

Field-by-field mapping is in [`orchestration/README.md`](orchestration/README.md).

### Governance inside the agent

`agent/policy/engine.py` answers one question per skill: allow, require
approval, or deny — from the skill's declared `allowed_states` /
`requires_approval`, the current event state, and org policy read from
`Organization.settings["agent_policy"]`. `email` always requires approval as a
backstop. Gates surface as `pending_approvals`, are persisted on the session, and
are executed by `POST /agent/sessions/{sid}/approve`.

---

## 7. Vendor sourcing and procurement

### Sourcing

`marketplace.Vendor` is seeded from [`../seeds/vendors.json`](../seeds/vendors.json)
(`manage.py seed_marketplace`) and augmented at planning time with live
**OpenStreetMap** discovery near the event location (Nominatim geocode →
Overpass query → upsert by `external_ref`). `VendorDiscoveryLog` is a 7-day TTL
cache so repeated turns don't re-hit the public endpoints.

Ranking is deterministic and explainable — `common/matching.py:vendor_score`
returns `(score, factors)` over budget fit (.3), reviews (.25), experience (.2),
availability (.15), and response time (.1). The per-factor breakdown is what the
UI shows as the reason.

> Discovery runs **inline in the turn**, so a user's message blocks on two public
> HTTP endpoints. Known cost, documented in `SYSTEM_BRIEF.md`.

### Procurement: shortlist → mail → lead

```
POST …/procurement/requests   one ProcurementRequest per category
                              + one Outreach row per counterparty
                              vendors with no email → status "no_channel", not dropped
                              (status: draft)
POST …/requests/{id}/send     ← THE ONLY GATE the organizer confirms
                              request → sent, reachable rows → queued
                              on_commit → send_outreach_batch (queue: outbox)
worker                        per row: compare-and-swap queued → sending,
                              then send_mail. Failures land on the row, never raised —
                              one bad address must not abandon the batch.
POST /procurement/respond/{token}   ← public, unauthenticated
                              record_response() → status responded/declined,
                              quote merged onto the same Outreach row
                              + in-app common.Notification to the organizer
GET  …/procurement/leads      cheapest first
```

The preview the organizer approves is byte-identical to what goes out because
`draft_outreach()` is deterministic, LLM-free, and a request is immutable between
create and send (there is no update endpoint) — so no second copy is stored.

**`POST /procurement/respond/{token}` is the one hostile trust boundary in the
codebase.** It has no auth, no organization, no membership. It is defended by:
unguessable 32-byte token, `request.is_open` (status + deadline), outreach status
check, `_clean_quote` (rejects bools/floats/out-of-range), email validation, text
caps, and `AnonRateThrottle` at `30/hour`. Treat any change there accordingly.

---

## 8. Data model at a glance

```
Organization ──< Membership >── User
     │              └──< PermissionGrant        (per-resource capability)
     └──< Event ─┬──< Milestone ──< Task
                 ├──< BudgetLineItem
                 ├──< Risk
                 ├──  SeatingPlan (1:1)
                 ├──< EventComment
                 ├──  AgentEventState (1:1)     agent sidecar
                 ├──< AgentSession ──< AgentTurn
                 │                  └──< AgentRun ──< AgentRunStep
                 ├──< EventVendorShortlist >── Vendor
                 ├──< ProcurementRequest ──< Outreach >── Vendor
                 └──< DomainEvent               outbox + idempotency ledger

Vendor ──< ServiceListing, PortfolioItem, AvailabilityHold, Review
```

Conventions you will hit immediately:

- **UUID primary keys everywhere** (`common.models.BaseModel` also gives
  `created_at` / `updated_at`).
- **Money is always minor units** in a `BigIntegerField` named `*_minor`, with a
  sibling `currency`. The agent normalizes user-stated major units ×100 once, at
  intake, in `runtime._detect_intent`.
- **`source` provenance** (`user` / `template` / `ai`) on planning rows. The
  agent's state store keys off it — see the gap note in `SYSTEM_BRIEF.md`.
- **`Event.revision`** is the optimistic-concurrency token, bumped by
  `Event.save()` and again by the mutation boundary.

---

## 9. Settings, environments, tests

`config/settings/` is a base + three overlays; pick with `DJANGO_SETTINGS_MODULE`.

| | `dev` | `test` | `prod` |
|---|---|---|---|
| DB | Postgres | SQLite `:memory:` | Postgres |
| Celery | eager (inline) | eager | real broker |
| Email | console backend (unless `EMAIL_HOST`) | locmem | SMTP |
| Throttling | `anon 30/hour` | off | `anon 30/hour` |

`base.py` defaults email to **SMTP, not console**, on purpose: a production
deploy that forgets `EMAIL_HOST` should fail loudly rather than silently drop
every message.

```bash
python manage.py test --settings=config.settings.test        # Django tests
python -m unittest agent.tests.test_agent -v                 # agent, no DB needed
python -m agent.demo                                         # end-to-end turn
```

Orchestration tests use a deterministic `FakeLLM` and eager Celery;
`TransactionTestCase` with serialized skills accommodates SQLite, while
production runs Postgres with full concurrency.

---

## 10. Where to add things

| You want to… | Do this |
|---|---|
| Add an event-scoped endpoint | Function view + `@permission_classes([IsAuthenticated])` + `accessible_event(request, event_id, write=…)`. Return 403 on `None`. |
| Add a write that must be audited/idempotent | Put it in `<app>/services.py` and wrap it in `execute_event_mutation`. Namespace your `idempotency_key`. |
| Add a background job | `@shared_task(name="app.thing")` **and** add a route in `CELERY_TASK_ROUTES`. |
| Add an agent skill | Subclass `agent.skills.base.Skill`, register in `skills/__init__.py:default_skills()`. Registry, policy, and prompts pick it up. Never list a field in both `reads` and `produces`. |
| Give a skill real backend data | Add/extend a port in `agent/services/ports.py`, implement it in `orchestration/adapters/services.py`. Never import Django in `agent/`. |
| Add an LLM provider | Implement `agent.llm.base.LLMClient`, call `register_provider(name, builder)`. |
| Consume domain events | Implement delivery in `orchestration.tasks.dispatch_outbox`. The retry/lease columns are already on `DomainEvent`. |

Before planning anything substantial, read the **Known gaps** and **Deliberately
not building** sections of [`../SYSTEM_BRIEF.md`](../SYSTEM_BRIEF.md) — they will
save you from re-proposing something that was already decided against.
