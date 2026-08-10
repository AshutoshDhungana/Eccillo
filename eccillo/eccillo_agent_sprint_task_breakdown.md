# Eccillo Agent Platform — Sprint Task Breakdown

Companion doc to the sprint plan. Tickets are grouped by epic, ordered so that
each one only depends on tickets above it in the same or an earlier epic.
IDs are stable references for standups and PR titles — copy them as-is into
Jira/Linear.

**Legend:** Priority P0 = blocks the sprint goal, P1 = needed for full scope,
P2 = nice to have if time allows. Size is rough: S ≈ 0.5–1 day, M ≈ 2–3 days,
L ≈ 4–5 days for one engineer.

---

## Epic A — Agent orchestration core (backend)

| ID | Title | Priority | Size | Depends on |
|---|---|---|---|---|
| AGT-A1 | Tool registry data model & migration | P0 | M | — |
| AGT-A2 | Wrap existing bounded actions as registered tools | P0 | L | AGT-A1 |
| AGT-A3 | Tool input/output schema validation layer | P0 | S | AGT-A1 |
| AGT-A4 | Planner service: goal → step plan decomposition | P0 | L | AGT-A1 |
| AGT-A5 | Plan validation & dry-run mode | P0 | M | AGT-A4 |
| AGT-A6 | Multi-step run state machine (extend Copilot run/job) | P0 | L | AGT-A2, AGT-A4 |
| AGT-A7 | Step checkpointing & resumable retries | P0 | M | AGT-A6 |
| AGT-A8 | Event-scoped agent memory/context store | P1 | M | — |
| AGT-A9 | Memory retrieval API for planner context injection | P1 | M | AGT-A4, AGT-A8 |

### AGT-A1 — Tool registry data model & migration
**Description:** Create an `AgentTool` model (or extend the existing Copilot
action catalog) capturing: tool name, owning domain app, input/output JSON
schema, risk tier (`read` / `propose` / `auto_safe` / `auto_sensitive`),
required idempotency-key flag, and enabled/disabled state per org.
**Acceptance criteria:**
- `AgentTool` table exists with the fields above and passes migration on a
  clean DB.
- Seed data registers at least the sourcing-chain actions needed for Epic D.
- Admin-only read endpoint lists all registered tools and their risk tier.
**Technical notes:** Lives in `backend/copilot` alongside the existing action
catalog rather than a new app — this is a schema addition, not a new domain.

### AGT-A2 — Wrap existing bounded actions as registered tools
**Description:** For each action needed by the sourcing pilot (need
discovery, vendor ranking, shortlist proposal, RFP draft prep), write a thin
adapter that exposes it through the `AgentTool` interface with a validated
schema, so the planner can call it generically instead of each action having
bespoke invocation code.
**Acceptance criteria:**
- Each wrapped action is callable via a single `execute_tool(tool_name, args)`
  entrypoint.
- Existing direct API routes for these actions are untouched and still work.
- Idempotency keys are enforced identically whether called directly or via
  the tool wrapper.
**Dependencies:** AGT-A1.

### AGT-A3 — Tool input/output schema validation layer
**Description:** Validate every tool call's arguments against its registered
schema before execution, and validate the tool's output before it's handed
back to the planner or written to the run log.
**Acceptance criteria:**
- Malformed tool arguments raise a typed validation error, not a 500.
- Schema violations are logged with the run ID for debugging.
**Dependencies:** AGT-A1.

### AGT-A4 — Planner service: goal → step plan decomposition
**Description:** Given an event's context (brief, plan, budget, task list)
and a stated goal (e.g. "fill the missing catering need"), produce an
ordered list of tool calls with arguments, using an LLM call constrained to
the registered tool schemas.
**Acceptance criteria:**
- Given a fixture event and goal, the planner returns a valid plan referencing
  only registered tools.
- Invalid or unregistered tool references in a generated plan are rejected
  before execution, not caught downstream.
- Planner calls are logged with the prompt, raw output, and parsed plan for
  auditability.
**Dependencies:** AGT-A1.

### AGT-A5 — Plan validation & dry-run mode
**Description:** Before a plan executes, validate step ordering (no step
depends on data a later step produces) and support a dry-run mode that
returns the plan without executing any tool.
**Acceptance criteria:**
- Dry-run returns the full step list with resolved arguments, no side effects.
- Circular or forward-referencing dependencies are rejected with a clear error.
**Dependencies:** AGT-A4.

### AGT-A6 — Multi-step run state machine
**Description:** Extend the existing Copilot run/job model to support a
sequence of steps with states (`pending`, `running`, `succeeded`, `failed`,
`awaiting_approval`, `cancelled`) instead of a single action per run.
**Acceptance criteria:**
- A run can have N steps, each independently transitions state.
- A failed step halts the run without corrupting completed steps' results.
- Run status is queryable mid-execution (for the activity feed in Epic D).
**Dependencies:** AGT-A2, AGT-A4.

### AGT-A7 — Step checkpointing & resumable retries
**Description:** Persist completed step outputs so a run can resume from the
last successful step after a transient failure, instead of restarting from
scratch.
**Acceptance criteria:**
- Killing the process mid-run and restarting the worker resumes from the
  last checkpoint, not step one.
- Retried steps reuse the same idempotency key so no action double-fires.
**Dependencies:** AGT-A6.

### AGT-A8 — Event-scoped agent memory/context store
**Description:** A per-event store that accumulates relevant context (past
agent runs, vendor interaction history, plan revisions) that the planner can
draw on, so repeated runs aren't cold-started.
**Acceptance criteria:**
- Store is scoped by event ID and readable/writable only within that event's
  authorization boundary.
- A second run for the same event and goal produces a measurably shorter
  plan (reusing prior findings) than a cold-start run.
**Dependencies:** none (can be built in parallel with A2–A7).

### AGT-A9 — Memory retrieval API for planner context injection
**Description:** Wire the memory store into the planner so relevant context
is automatically retrieved and injected before plan generation.
**Acceptance criteria:** Planner-generated plans visibly reference prior
context (e.g. "vendor X already declined" isn't re-proposed).
**Dependencies:** AGT-A4, AGT-A8.

---

## Epic B — Autonomy & policy framework (backend + governance)

| ID | Title | Priority | Size | Depends on |
|---|---|---|---|---|
| AGT-B1 | AutonomyPolicy model (org/event/action-type/tier) | P0 | M | AGT-A1 |
| AGT-B2 | Guardrail enforcement middleware for tool calls | P0 | M | AGT-B1, AGT-A3 |
| AGT-B3 | Spend cap & rate-limit enforcement | P0 | S | AGT-B2 |
| AGT-B4 | Kill switch (org + event level) | P0 | S | AGT-A6 |
| AGT-B5 | Escalation routing to existing approval chain | P0 | M | AGT-B2 |
| AGT-B6 | Decision-rationale capture in domain-event/outbox | P1 | S | AGT-A4 |
| AGT-B7 | Policy admin API endpoints | P1 | S | AGT-B1 |

### AGT-B1 — AutonomyPolicy model
**Description:** A policy record keyed by org (and optionally event) and
action-type, storing tier: `off` / `propose_only` / `auto_safe_capped` /
`full_auto`.
**Acceptance criteria:** Policy lookups resolve event-level overrides before
falling back to org-level defaults; unset action types default to
`propose_only`, never to auto-execute.
**Dependencies:** AGT-A1 (needs the tool/action-type vocabulary).

### AGT-B2 — Guardrail enforcement middleware for tool calls
**Description:** A single choke point that every tool call passes through
before execution, checking the resolved autonomy tier and either allowing
execution, routing to approval, or blocking outright.
**Acceptance criteria:** No code path can invoke `execute_tool` while
bypassing this check — verified with a test that attempts a direct call and
confirms it's rejected without a policy check.
**Dependencies:** AGT-B1, AGT-A3.

### AGT-B3 — Spend cap & rate-limit enforcement
**Description:** Per-org and per-event caps on total agent spend and action
frequency, enforced inside the guardrail middleware.
**Acceptance criteria:** A run that would exceed the cap halts before the
offending tool call executes, with the partial run left in a resumable
state, not silently dropped.
**Dependencies:** AGT-B2.

### AGT-B4 — Kill switch
**Description:** An org-level and event-level flag that, when set, cancels
in-flight runs and blocks new ones from starting.
**Acceptance criteria:** Flipping the switch mid-run halts the run within one
polling cycle; a clear "paused by kill switch" state is visible on the run.
**Dependencies:** AGT-A6.

### AGT-B5 — Escalation routing to existing approval chain
**Description:** When guardrails route a step to `propose_only` or the tier
requires escalation, the step lands in the existing approval-chain
infrastructure rather than a new, parallel queue.
**Acceptance criteria:** An escalated step appears in the same approvals
surface as existing human-originated approvals, tagged as agent-originated.
**Dependencies:** AGT-B2.

### AGT-B6 — Decision-rationale capture
**Description:** Extend the domain-event/outbox record to store why the
planner chose a given step (not just what it did), pulled from the planner's
logged reasoning.
**Acceptance criteria:** Every executed or escalated step has a
human-readable rationale string attached, visible in the run transcript.
**Dependencies:** AGT-A4.

### AGT-B7 — Policy admin API endpoints
**Description:** CRUD endpoints for org/event admins to view and set
autonomy tiers, spend caps, and the kill switch.
**Acceptance criteria:** Only users with the relevant admin capability grant
can modify policy; all changes are themselves recorded as domain events.
**Dependencies:** AGT-B1.

---

## Epic C — Proactive triggers (backend)

| ID | Title | Priority | Size | Depends on |
|---|---|---|---|---|
| AGT-C1 | Trigger definition model (schedule vs. condition-watch) | P1 | M | — |
| AGT-C2 | Scheduled trigger runner | P1 | M | AGT-C1 |
| AGT-C3 | Condition-watch triggers (budget drift, overdue task, RSVP velocity, vendor non-response) | P1 | L | AGT-C1 |
| AGT-C4 | Trigger → planner handoff wiring | P1 | S | AGT-C2, AGT-C3, AGT-A4 |

### AGT-C1 — Trigger definition model
**Description:** A record type describing what starts an agent run without a
user prompt: either a cron-like schedule or a condition expression evaluated
against event data.
**Acceptance criteria:** Supports both trigger kinds behind one interface so
downstream code doesn't branch on trigger type.
**Dependencies:** none — can start in parallel with Epic A/B.

### AGT-C2 — Scheduled trigger runner
**Description:** Extends the existing background job runner to fire
scheduled triggers at their configured cadence.
**Acceptance criteria:** A trigger scheduled hourly fires reliably across
worker restarts, with no duplicate fires.
**Dependencies:** AGT-C1.

### AGT-C3 — Condition-watch triggers
**Description:** Implement the four launch-condition checks: budget drift
beyond a threshold, a task past its due date, RSVP velocity below plan pace,
and a vendor gone unresponsive past a configurable window.
**Acceptance criteria:** Each condition has a fixture test proving it fires
at the threshold and does not fire below it.
**Dependencies:** AGT-C1.

### AGT-C4 — Trigger → planner handoff wiring
**Description:** When a trigger fires, it constructs a goal and hands it to
the planner (AGT-A4) to start a run.
**Acceptance criteria:** A fired trigger results in a new run visible in the
run list within one polling cycle.
**Dependencies:** AGT-C2, AGT-C3, AGT-A4.

---

## Epic D — Pilot: autonomous sourcing agent (backend + frontend)

This is the sprint's proof point — everything above exists to make this work
end to end.

| ID | Title | Priority | Size | Depends on |
|---|---|---|---|---|
| AGT-D1 | Define sourcing-agent tool chain spec | P0 | M | AGT-A2 |
| AGT-D2 | Wire chain into planner + tool registry | P0 | L | AGT-D1, AGT-A4, AGT-B2 |
| AGT-D3 | Unmet-need detection integration | P0 | M | existing heuristic suggested-needs engine |
| AGT-D4 | End-to-end run test: trigger → queued proposal | P0 | M | AGT-D2, AGT-D3, AGT-C4 |
| AGT-D5 | Agent activity feed API | P0 | M | AGT-A6, AGT-B6 |
| AGT-D6 | Agent activity feed UI | P0 | M | AGT-D5 |
| AGT-D7 | Inline approve/reject on feed | P0 | S | AGT-D6, AGT-B5 |

### AGT-D1 — Define sourcing-agent tool chain spec
**Description:** Document and encode the exact sequence — need discovery →
structured intent extraction → deterministic ranking → shortlist proposal →
internal RFP draft prep — as a named, reusable plan template rather than a
planner-generated plan from scratch each time.
**Acceptance criteria:** The template is versioned and referencing it
produces the same step sequence deterministically, with only the arguments
varying per run.
**Dependencies:** AGT-A2.

### AGT-D2 — Wire chain into planner + tool registry
**Description:** Register the template so the planner can invoke it as a
single high-level goal ("source a vendor for need X") that expands to the
full step sequence.
**Acceptance criteria:** Calling the planner with this goal produces a run
matching the AGT-D1 template exactly.
**Dependencies:** AGT-D1, AGT-A4, AGT-B2.

### AGT-D3 — Unmet-need detection integration
**Description:** Connect the existing heuristic suggested-needs engine
(plan/budget/tasks/RFPs/shortlists) as a trigger source: an unmet need above
a confidence threshold becomes a goal for the sourcing agent.
**Acceptance criteria:** A fixture event with a known gap (e.g. no catering
vendor 30 days out) produces exactly one sourcing-agent goal, not duplicates
on repeated evaluation.
**Dependencies:** existing suggested-needs engine (already shipped).

### AGT-D4 — End-to-end run test
**Description:** Full integration test from trigger fire to a queued,
approvable RFP draft proposal, with no manual intervention until the
approval step.
**Acceptance criteria:** Test passes reliably in CI; run transcript shows all
steps, their rationale, and the final `awaiting_approval` state.
**Dependencies:** AGT-D2, AGT-D3, AGT-C4.

### AGT-D5 — Agent activity feed API
**Description:** Read endpoint returning runs for an event, each with its
steps, current state, and rationale.
**Acceptance criteria:** Endpoint paginates, scopes to event authorization,
and reflects live run status (not a stale snapshot).
**Dependencies:** AGT-A6, AGT-B6.

### AGT-D6 — Agent activity feed UI
**Description:** New component rendering the run list and step-by-step
detail, added to the event shell.
**Acceptance criteria:** A running agent's steps update in near-real-time
without a manual page refresh.
**Dependencies:** AGT-D5.

### AGT-D7 — Inline approve/reject on feed
**Description:** Approve/reject controls directly in the feed for any step
in `awaiting_approval` state, reusing the existing approval-chain action.
**Acceptance criteria:** Approving from the feed has the same effect as
approving from the global approvals queue — one underlying action, two
surfaces.
**Dependencies:** AGT-D6, AGT-B5.

---

## Epic E — Agent command center (frontend)

| ID | Title | Priority | Size | Depends on |
|---|---|---|---|---|
| AGT-E1 | "Agents" sidebar route & page shell | P1 | S | — |
| AGT-E2 | Per-domain agent status cards | P1 | M | AGT-D5 |
| AGT-E3 | Autonomy tier control UI | P1 | M | AGT-B7 |
| AGT-E4 | Agent settings panel (on/off, tier, budget cap) per event | P1 | M | AGT-B7 |
| AGT-E5 | Approvals queue: agent- vs. user-origin distinction | P1 | S | AGT-B5 |
| AGT-E6 | Batch approve action | P1 | S | AGT-E5 |
| AGT-E7 | Run transcript detail view | P1 | M | AGT-D5, AGT-B6 |

### AGT-E1 — "Agents" sidebar route & page shell
**Description:** New top-level sidebar destination alongside Brief,
Blueprint, Planning, Shortlist, Execute, Collaboration, Insights, Copilot.
**Acceptance criteria:** Route follows existing event-shell navigation
conventions; empty state renders cleanly with zero agents configured.
**Dependencies:** none.

### AGT-E2 — Per-domain agent status cards
**Description:** One card per domain agent (sourcing to start; others as
they ship) showing on/off state, last run time, and a link into its
activity feed.
**Dependencies:** AGT-D5.

### AGT-E3 — Autonomy tier control UI
**Description:** Control surface for setting the tier per action type,
reflecting AGT-B1/B7 under the hood.
**Acceptance criteria:** Changing a tier in the UI is reflected in guardrail
enforcement within one request cycle — no caching lag that lets a stale tier
authorize an action.
**Dependencies:** AGT-B7.

### AGT-E4 — Agent settings panel per event
**Description:** Event-scoped panel: which agents are enabled, their tier,
and their budget cap for this event specifically (overriding org defaults).
**Dependencies:** AGT-B7.

### AGT-E5 — Approvals queue: origin distinction
**Description:** Tag and visually distinguish agent-originated approval
items from user-originated ones in the existing global queue.
**Dependencies:** AGT-B5.

### AGT-E6 — Batch approve action
**Description:** Select multiple agent-originated, same-type approval items
and approve them in one action.
**Acceptance criteria:** Batch approval still writes one domain-event per
item — no collapsing of the audit trail for convenience.
**Dependencies:** AGT-E5.

### AGT-E7 — Run transcript detail view
**Description:** Full step-by-step view of a single run: inputs, outputs,
rationale, and timing for each step.
**Dependencies:** AGT-D5, AGT-B6.

---

## Epic F — Observability & trust (cross-cutting)

| ID | Title | Priority | Size | Depends on |
|---|---|---|---|---|
| AGT-F1 | Agent metrics aggregation | P2 | M | AGT-A6 |
| AGT-F2 | Metrics dashboard widget | P2 | S | AGT-F1 |
| AGT-F3 | Rollback affordance for reversible actions | P2 | M | AGT-A7 |

### AGT-F1 — Agent metrics aggregation
**Description:** Compute run success rate, auto-approved vs. escalated
ratio, time-to-shortlist, and cost per run.
**Dependencies:** AGT-A6.

### AGT-F2 — Metrics dashboard widget
**Description:** Surface AGT-F1 metrics in the existing Insights area.
**Dependencies:** AGT-F1.

### AGT-F3 — Rollback affordance for reversible actions
**Description:** For any tool marked reversible in its registry entry,
provide a one-click undo that's itself an audited action, not a silent
delete.
**Dependencies:** AGT-A7.

---

## Suggested two-week sequencing

**Week 1 — foundation, in parallel where marked:**
- Backend track 1: AGT-A1 → A2 → A3 → A4
- Backend track 2 (parallel): AGT-B1 → B2 → B3, AGT-C1 → C2/C3
- Backend track 3 (parallel): AGT-A8 (memory store, no dependencies)

**Week 1 end / Week 2 start — integration:**
- AGT-A6 → A7 (run state machine, needs A2 + A4 done)
- AGT-B4, B5, B6 (guardrail completions, need B2 done)
- AGT-D1 → D2 → D3 (pilot chain, needs A2, A4, B2 done)

**Week 2 — pilot close-out and frontend:**
- AGT-D4 (end-to-end test) as the sprint's core gate
- AGT-D5 → D6 → D7 (activity feed, in parallel with D4 once D5's API is stable)
- AGT-E1 → E2/E3/E4 (command center, can start as soon as B7 lands)
- AGT-E5 → E6 (approvals queue upgrade, needs only B5)
- AGT-F1/F2/F3 only if time remains — these are explicitly the cut line if
  the sprint runs long.

**Critical path for the sprint goal (closed-loop sourcing agent, end to
end):** A1 → A2 → A4 → B1 → B2 → D1 → D2 → D3 → C4 → D4 → D5 → D6 → D7.
Everything else can slip a sprint without breaking the demo.

## Suggested team split
- 2 backend engineers on Epic A (orchestration core) — this is the longest
  pole and the whole sprint depends on it landing on time.
- 1 backend engineer on Epic B (guardrails), starting once AGT-A1 lands.
- 1 backend engineer on Epic C, fully parallel from day one.
- 1 backend + 1 frontend engineer pairing on Epic D once A and B's
  prerequisites are ready — this pairing is what turns infrastructure into a
  visible demo.
- 1 frontend engineer on Epic E, starting once AGT-B7's shape is agreed even
  before it's fully implemented (build against a contract, not a live API).
- Epic F is fill-in work for whoever finishes early.
