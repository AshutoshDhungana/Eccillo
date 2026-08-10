# Google Calendar & Governed Mail Tasks

## Planning workspace UX follow-up

| ID | Status | Deliverable |
| --- | --- | --- |
| UX-1 | Done | Redesign planning controls with the Eccillo atmospheric editorial system. |
| UX-2 | Done | Dynamic day, week, and month timeline breakdowns. |
| UX-3 | Done | Budget allocation driven exclusively by the event's saved budget lines. |
| UX-4 | Done | Calendar setup guidance in the Calendar workspace and Settings, without exposing service-account secrets in the browser. |
| UX-5 | Done | AI risk register is read-only apart from an explicit Ignore action. |

| ID | Status | Deliverable |
| --- | --- | --- |
| INT-1 | Done | Deployment settings, service-account Calendar client, SMTP delivery adapter, and test-safe defaults. |
| INT-2 | Done | `CalendarSyncLink` and `EmailDelivery` persistence with migrations and tenant/event scope. |
| INT-3 | Done | Idempotent create/update Calendar sync for events, sessions, milestones, and dated tasks. |
| INT-4 | Done | Calendar outbox consumer with retry-safe provider errors and kill-switch enforcement. |
| INT-5 | Done | Calendar status and manual-sync API. |
| INT-6 | Done | Registered draft/send email actions, with approval required for sending. |
| INT-7 | Done | Approved email hand-off through durable outbox delivery and SMTP status tracking. |
| INT-8 | Done | Calendar controls/status are visible in the active event Calendar workspace; mail actions reuse the existing review queue. |
| INT-9 | Done | Calendar create/update/delete and mail delivery coverage, migration validation, backend tests, and production build. |

## Acceptance checks

- A retry never creates a duplicate Google Calendar event.
- Calendar configuration failures do not corrupt event data.
- Rejected email actions produce no delivery record or mail.
- Approved sends are queued once and delivery failures remain visible/retryable.
- Cross-tenant actions, disabled tools, and kill-switched event execution fail closed.
