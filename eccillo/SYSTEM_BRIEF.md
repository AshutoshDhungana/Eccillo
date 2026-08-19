# Eccillo — System Brief

What the code actually does today. If something is not in here, it is not built.

> This file replaced `SYSTEM_BRIEF_CURRENT_SPRINT.md`, which described a much
> larger pre-revert build (apps `procurement`, `sponsors`, `talents`,
> `operations`, `documents`, `payments`, `analytics`, `copilot`) that was rolled
> back to a lean core. Treat any older doc or ticket referencing those apps as
> describing software that no longer exists.

## Shape of the repo

`backend/` is a Django 5 + DRF project with seven apps:

| App | Role |
|---|---|
| `accounts` | Organization / User / Membership / PermissionGrant. The multi-tenant root. |
| `common` | Cross-cutting: JWT auth, event-scoped permissions, transactional outbox (`DomainEvent`), idempotency, approval chains, notifications, vendor scoring. |
| `planning` | The canonical domain: Event, Milestone, Task, BudgetLineItem, Risk, SeatingPlan. |
| `marketplace` | Vendor, ServiceListing, AvailabilityHold, EventVendorShortlist, Review, plus OSM discovery provenance. Data layer only — no views, not mounted. |
| `procurement` | Quote requests, outreach to counterparties, and the leads that come back. |
| `agent` | The AI layer. Pure Python, **zero Django imports**. |
| `orchestration` | The glue: Django adapters implementing the agent's ports, the Celery turn task, and the Conversation API. |

`frontend/` is React 18 + TypeScript + Vite + React Query + Tailwind.

The load-bearing architectural decision: `agent/` knows nothing about Django. It
talks to the platform only through the abstract ports in
`agent/services/ports.py`; `orchestration/adapters/` implements them against the
ORM. That is what lets the whole agent be tested without a database.

## What the backend can do

### Identity and tenancy
Registration, login, refresh, logout, organization switching. Organizations,
memberships, roles (`owner/admin/manager/member/finance/viewer`), and per-resource
capability grants. Every event-scoped view authorizes through
`common.permissions.accessible_event`.

### Planning
Create/list/retrieve/update events, public lookup by slug. Milestones, tasks,
budget lines, risks, seating plans, comments. Source provenance (`user` / `ai`)
on planning records.

### AI planning agent
A conversation API that runs each turn in the background and returns a `run_id`
to poll. The LLM advises — intent detection, clarification wording, response
prose — and a deterministic DAG of skills executes. See
[`backend/agent/README.md`](backend/agent/README.md) and
[`backend/orchestration/README.md`](backend/orchestration/README.md).

### Vendor sourcing
A curated marketplace seeded from `seeds/vendors.json`, augmented at planning
time with live OpenStreetMap discovery near the event location (Nominatim +
Overpass), persisted into `marketplace.Vendor` with a TTL cache. Explainable
ranking in `common/matching.py` scores budget fit, reviews, response time,
experience, and availability, and returns the per-factor breakdown.

### Procurement
This is what turns a shortlist into actual leads.

1. The organizer selects vendors and asks for quotes. One `ProcurementRequest`
   is drafted per category — a caterer is not asked to quote for a venue.
2. Each selected counterparty gets an `Outreach` row. Vendors with no email on
   file are recorded as `no_channel` rather than silently dropped.
3. The organizer reviews the exact outgoing text and recipient list, then
   confirms once. **That is the only gate.**
4. Mail goes out carrying a per-counterparty tokenized reply link.
5. The counterparty answers on a public page — no account, no sign-in — and
   their quote lands as a lead, cheapest first, with an in-app notification.

The reply endpoint is an unauthenticated trust boundary and is treated as
hostile: deadline enforcement, request/outreach status checks, numeric bounds,
text caps, email validation, and anonymous throttling. The budget ceiling is
disclosed to counterparties only when `share_budget` is set — naming a ceiling
anchors every quote to it.

### Governance
Organizer-facing writes route through `common.event_mutations.execute_event_mutation`,
which serializes writes per event with a row lock, replays a reused idempotency
key instead of re-running, bumps the event revision, and emits a durable
`DomainEvent` in the same transaction. Approval chains and steps exist in
`common`, and the agent gates outbound skills through `agent/policy/engine.py`.

## Frontend

Landing, sign-in, sign-up, dashboard, event list. Inside an event: Copilot,
Vendors, Procurement, and Planning (timeline / budget / tasks / calendar /
risks). One public route outside the auth shell — `/respond/:token`, the
counterparty quote page.

## Running it

See [`README.md`](README.md). Outreach prints to the console in dev unless you
set `EMAIL_HOST`; nothing else has to change to send for real.

## Known gaps

Real, current, and worth knowing before you plan work:

- **Pending approvals are wiped by unrelated turns.** `orchestration/tasks.py`
  assigns `session.pending_approvals` unconditionally, and clarification and
  summary turns return `[]`. Gate an action, ask a follow-up question, and the
  gate is erased. One guard fixes it.
- **OSM discovery runs inside the turn.** `DjangoVenueService.search` blocks a
  user's message on two public endpoints. It belongs in its own task keyed on
  location+category; the `VendorDiscoveryLog` TTL cache already makes that safe.
- **No attendees.** `guests` is a JSON list of segment counts; there is not a
  single attendee row. Registration, RSVP, ticketing, and check-in are the
  missing half of "event management", and the `BOOKING → EXECUTION → LIVE`
  states have nothing behind them.
- **No LLM cost metering.** Any authenticated user can loop `POST /agent/messages`;
  `AgentRun.observability` already records exact token counts and nothing reads them.
- **Auth hardening.** `SECRET_KEY` has a dev default and signs the JWTs; `logout`
  is a no-op with no revocation list; `create_organization` is `AllowAny`.
  Throttling is configured only for the public procurement reply page.
- **Thin tests.** The state store's `_sync_children` deletes and recreates rows
  by `source="ai"` on every save, and nothing tests that a user-edited milestone
  survives that.

## Deliberately not building

- **An LLM planner.** `select_workflow` is a short if-chain over hardcoded DAGs.
  That determinism is why every response is grounded and every run reproducible.
  Add named workflows; do not hand the model the step order.
- **A multi-agent framework.** The "agents" are deterministic Python classes with
  declared schemas, dependencies, and state gates. That beats a dozen chat loops.
- **SSE/WebSocket streaming.** The latency problem is discovery, not transport.
- **Sponsors, talent, and documents as separate domains.** Procurement is generic
  over its counterparty; a Talent or Sponsor model slots in behind the same flow.
