# Eccillo System Brief — Current Sprint

## Purpose and scope

Eccillo is an event operating system for organizers. It brings event planning,
provider sourcing, operational setup, collaboration, analytics, and governed
AI assistance into one event-scoped workspace.

This brief describes the code implemented through the current Need-First
Procurement sprint. It distinguishes what the backend can persist or expose
from what the React application currently presents. A route or model is not a
claim that an external action is live: publishing, provider outreach,
contracting, signing, and money movement remain protected or disabled.

## Agent platform transition

Eccillo is now evolving from a conversational Copilot into a governed agent
platform. The existing durable Copilot run graph is the execution foundation:
it already persists multi-step jobs, their dependencies, action proposals,
progress events, idempotency keys, and approval state. The agent experience
adds an event-scoped **Agents** destination and a focused activity-feed API at
`GET /events/{event_id}/agents/activity`.

The feed is a read-only projection of the durable run graph. It exposes each
run's intent, trigger, status, ordered specialist steps, tool proposals, and
pending approvals; it never exposes raw planner context or makes a second
approval path. Inline approval/rejection in the Agents page calls the same
governed Copilot action endpoints used by the global action queue.

The first visible domain agent is **Sourcing**. Its current bounded workflow
can discover event needs, rank vendors, prepare shortlist/RFP proposals, and
pause for approval. This is intentionally supervised autonomy: external
outreach, commitments, signatures, and financial actions continue to require
the established policy and approval controls while the remaining orchestration
and per-event policy tickets in the agent sprint are delivered.

## Architecture at a glance

| Layer | Current implementation |
| --- | --- |
| Web app | React 18, TypeScript, Vite, React Query, React Router, Tailwind-based Eccillo UI. |
| API | Django 5 and Django REST Framework under `/api/v1`. |
| Data | PostgreSQL-oriented Django models, UUID resources, organization and event scoping. |
| Authentication | JWT access/refresh tokens stored in browser storage; authenticated routes redirect to sign-in. |
| Safety | Idempotency keys for writes, organization checks, event revisions where applicable, durable domain-event records, and approval/action records. |
| AI support | A Copilot control plane plus bounded, approval-aware action proposals. Vendor discovery uses structured intent with a deterministic fallback. |

## Backend capabilities

### Identity, tenancy, and shared governance

- User registration, login, logout, token refresh, organization switching, and current-user lookup.
- Organizations, memberships, roles, and resource capability grants.
- Event-scoped and organization-scoped authorization across organizer-owned data.
- Idempotency records for safe retried writes.
- Domain-event/outbox records for durable audit and later delivery.
- Approval chains, ordered approval steps, and in-app notification records.

### Event intake and planning

- Create, list, retrieve, and update events; public lookup by event slug.
- Capture a durable event brief, revisions, missing details, assumptions, and field provenance.
- Generate and retain versioned event plans and plan artifacts.
- Prepare and apply plan changes with event revision awareness.
- Maintain milestones, tasks, budgets, risks, seating plans, templates, and event comments.
- Track source/provenance for planning records, including human and AI-suggested data.

### Marketplace and need-first vendor sourcing

- Public vendor catalog, vendor detail, vendor listing/profile management, availability records, and vendor reviews.
- Authenticated, event-scoped discovery endpoint for natural-language needs.
- Structured intent extraction with validation and deterministic parsing fallback.
- Deterministic vendor ranking with transparent fit reasons.
- Supported constraints include category, budget, service area, date availability, rating, and capacity.
- Event-scoped suggested needs based on plan, budget, tasks, existing RFPs, and shortlists. These are explicitly heuristic suggestions.
- Event vendor shortlist read endpoint, including saved and awaiting-confirmation state.
- Governed shortlist proposal flow; duplicate vendor additions are prevented.

### Procurement

- Event-scoped RFP draft creation, listing, retrieval, and permitted internal updates.
- An RFP contains category, scope, requirements, budget ceiling, currency, deadline, visibility, and status.
- `RFPDraftCandidate` stores selected vendors as internal candidates. It is intentionally separate from an invitation and cannot expose an RFP to a vendor.
- RFP detail includes draft candidates and any existing invitations.
- Proposal records and a deterministic proposal comparison endpoint exist for eligible submitted or shortlisted proposals.
- Contract and payment-milestone records are modeled and can be read where authorized.

### Sponsor and talent sourcing

- Sponsor organization profile, event sponsorship opportunities, sponsorship tiers, deterministic matching, and deal records.
- Event-scoped sponsor-deal summaries for the shortlist workspace.
- Talent profiles, availability, recommendation, reviews, and event booking requests.
- Event-scoped talent booking summaries for the shortlist workspace.

### Event operations

- Registration-form schema management.
- Ticket-type creation, free ticket orders, ticket lookup, RSVP, and attendee listing.
- Agenda sessions, public agenda reads, and agenda session linkage for talent bookings.
- QR/check-in processing with duplicate protection and per-gate statistics.
- Volunteer and exhibitor-booth management.
- Certificate issuance.
- Models and guarded routes for polls and surveys; public responses are supported only for already-open resources.

### Documents, analytics, payments, and Copilot

- Private event/organization document metadata, upload, validation, download, and optional RFP association. Supported uploads include PDF, Office files, CSV/TXT, PNG, and JPEG with a configured size limit.
- Event-health snapshots, metrics, feedback analysis, sponsor ROI, benchmarks, and downloadable report payloads.
- Payment and payout models; payout records can be read.
- Copilot conversations, messages, runs, jobs, progress events, tool/action proposals, settings, proactive rules, action catalog, metrics, and readiness endpoints.
- Copilot persistence is organization scoped and supports policy, model/tool allowlists, usage limits, retention settings, and knowledge/retrieval records.
- Agent activity feed with paginated event-scoped runs, step transcripts, and pending governed proposals.
- Deployment-managed Google Calendar synchronization for event dates, agenda sessions, milestones, and dated tasks. It is one-way from Eccillo, idempotent, retry-safe through the durable outbox, and can be paused by the existing autonomy kill switch.
- Governed outbound email drafts and sends. Agents may prepare typed drafts; an authorized organizer must approve every send, after which SMTP delivery is persisted and retried through the durable outbox.

## Frontend experience

### Entry points and navigation

- Marketing landing page, sign-in, sign-up, dashboard, event list, and public event page.
- One authenticated event shell with sidebar navigation, notifications, user context, and responsive mobile navigation.
- Event routes for brief, blueprint, planning, shortlist, execute, collaboration, insights, and Copilot.
- Legacy Find URLs redirect into the event-aware need launcher.

### Event creation and planning UI

- Event brief intake and a generated plan/blueprint review flow.
- Planning pages for timeline, budget, tasks, calendar, and risks.
- Event-plan artifacts, revisions, and apply/review interactions where available.
- Collaboration page for team membership, event comments, task status, and action review.

### Need-first sourcing UI

- “What do you need?” is a shared event-scoped launcher, available from the sidebar and header and via `Ctrl/Cmd+K`.
- Its URL state is shareable through `?source=1&q=`.
- It presents popular needs and plan-derived suggestions, with a heuristic disclaimer.
- Organizers can search vendors with natural language, refine supported filters, inspect a vendor detail panel, and compare up to four vendors.
- The launcher supports governed shortlist proposals and confirmation.
- It can prepare an internal RFP draft from selected vendors, then opens that draft in Procurement.

### Shortlist and procurement UI

- The **Shortlist** sidebar destination shows event-scoped vendor shortlist entries, including saved and awaiting-confirmation state.
- It also exposes adjacent **Talent** and **Sponsors** tabs for their event booking requests and deal proposals.
- A shortlisted vendor has a clear route into Procurement.
- Procurement shows heuristic sourcing suggestions, a manual internal-RFP form, event RFP list, RFP detail, internal draft candidates, existing proposals, and comparison output.
- Execute modules for Registration, Agenda, Tickets, Volunteers & booths, Check-in, Documents, and Payments remain separate sidebar destinations. They are no longer duplicated as tabs inside Procurement.

### Operations, reporting, and administration UI

- Interfaces for registration forms, agenda sessions, ticket types/orders, volunteers/booths, check-in, documents, and payment/payout review.
- Insights for event health, metrics, feedback, sponsor ROI, benchmarks, and downloadable JSON reports.
- Copilot conversation screen, event action review, global actions queue, notifications, and Copilot settings.
- Agents command surface with sourcing-agent status, live activity transcript polling, and inline approval/rejection.

## Governance boundaries in this sprint

The following are intentionally **not** executed directly by the current product:

- Sending RFP invitations or making marketplace RFPs public.
- Contacting vendors, placing availability holds, or inviting providers from a draft shortlist.
- Awarding an RFP, creating or changing a contract, or signing a document.
- Creating payment intents, capturing payments, releasing payment milestones, payouts, refunds, or escrow movement.
- Paid ticket checkout.
- Publishing public polls, surveys, or sponsorship opportunities without the governed path.

Direct APIs for many of these operations return a conflict response and direct the caller to the governed approval workflow. An internal RFP draft and its candidates are planning records only; they are not messages or commitments.

## Deferred beyond this sprint

- Automated and manual test implementation for this procurement work.
- Sponsor/talent discovery parity beyond the currently surfaced request/proposal records.
- Richer provider capabilities, folders, voting, comments, provider collaboration, quote delivery, relationship graph, and post-hire workflows.
- Production provider adapters for outreach, e-signature, payment processing, and public publishing.

## Primary source locations

- Backend API composition: `backend/config/urls.py`
- Backend domain apps: `backend/{accounts,planning,marketplace,procurement,sponsors,talents,operations,documents,payments,analytics,copilot}`
- Frontend routes: `frontend/src/App.tsx`
- Shared event shell and launcher: `frontend/src/components/AppShell.tsx`, `frontend/src/components/NeedDiscoveryDrawer.tsx`
- Main workspace pages: `frontend/src/pages/CorePages.tsx`, `frontend/src/pages/PillarPages.tsx`, `frontend/src/pages/ShortlistPage.tsx`
