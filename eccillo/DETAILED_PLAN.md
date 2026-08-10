# Google Calendar & Governed Mail Sprint

## Delivered scope

Eccillo synchronizes its event, agenda sessions, milestones, and dated tasks to one deployment-managed Google Calendar. It uses a service-account JSON value and a pre-created, shared calendar ID; no organizer OAuth, account connection, or browser credential flow exists.

Event mutations emit durable outbox facts. When calendar sync is enabled, the outbox consumer performs an idempotent one-way update and persists the Google event ID, ETag, source fingerprint, status, and error in `CalendarSyncLink`. The agent kill switch blocks manual and autonomous syncs.

Agents can create typed `draft_event_email` proposals and `send_event_email` actions. Sending is always approval-chain gated. Approval creates an `EmailDelivery` record and a durable outbox event; the worker sends using Django SMTP and records status, attempts, errors, and the provider message ID. Inbox reading, automatic replies, SMS, Chat, OAuth, and OpenClaw remain out of scope.

## Deployment configuration

Set `GOOGLE_CALENDAR_ENABLED=true`, `GOOGLE_CALENDAR_ID`, and `GOOGLE_SERVICE_ACCOUNT_JSON` (the complete JSON document). Share the target calendar with the service-account email and grant it permission to change events. Configure Django SMTP through `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `EMAIL_USE_TLS`, and `DEFAULT_FROM_EMAIL`.

The shared calendar and SMTP mailbox are deployment assets. Their secrets never enter browser APIs, Copilot memory, run transcripts, or audit payloads.

## Interfaces and operation

- `GET /api/v1/events/{event_id}/calendar/google/status` returns configuration and sync health.
- `POST /api/v1/events/{event_id}/calendar/google/sync` performs an authorized manual sync.
- `sync_google_calendar` is a registered guarded agent tool.
- `draft_event_email` is internal-only; `send_event_email` uses the existing Copilot approval endpoints.

Provider failures are stored on the durable record and re-raised to the outbox for retry. A disabled calendar integration is a safe no-op for autonomous domain events and a clear `409` for manual sync.
