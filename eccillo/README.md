# Eccillo — Event Management App

Plan an event with an AI copilot, source vendors near you, and get real quotes
back from them — in one workspace.

## Quick start

```bash
cp .env.example .env
make db          # Postgres + Redis via infra/docker-compose.yml
make install
make migrate
make superuser
make api         # http://localhost:8000
make web         # http://localhost:5173
```

Seed some vendors so sourcing has something to work with:

```bash
make seed                                                    # curated vendors
python backend/manage.py discover_vendors --location "Kathmandu"   # + live OSM
```

Set an LLM provider in `.env` (`AGENT_LLM_PROVIDER=ollama` needs no API key and
runs locally). Outreach email prints to the console until you set `EMAIL_HOST`.

## Stack

- Backend: Django 5 + Django REST Framework, Celery, PostgreSQL
- Frontend: React 18 + TypeScript + Vite + React Query + Tailwind
- LLM: provider-agnostic — OpenAI, Anthropic, Gemini, Ollama, or any
  OpenAI-compatible server

## What it does

- **Plan** — describe your event in chat; the agent derives a timeline, budget
  split, task list, guest segments, and risks, and keeps them in real tables
- **Source** — ranked vendor suggestions near the event, from a curated
  marketplace plus live OpenStreetMap discovery, with the reasons for each score
- **Procure** — pick vendors, review one message, send; they quote back on a
  public link and the quotes arrive as leads
- **Track** — milestones, tasks, budget lines, and a risk register per event

## Tests

```bash
cd backend && python manage.py test --settings=config.settings.test
python -m unittest agent.tests.test_agent -v      # agent layer, no DB needed
cd ../frontend && npm test
```

## Docs

- [`SYSTEM_BRIEF.md`](SYSTEM_BRIEF.md) — what exists, what does not, known gaps
- [`backend/agent/README.md`](backend/agent/README.md) — the AI layer
- [`backend/orchestration/README.md`](backend/orchestration/README.md) — how it
  is wired into Django
