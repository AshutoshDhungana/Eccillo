.PHONY: up down db db-stop api web worker migrate seed superuser test install install-deps check

PYTHON := backend/.venv/Scripts/python.exe
PIP    := backend/.venv/Scripts/pip.exe

# ── Docker infra ──────────────────────────────────────────────────────────────
# One command starts everything the app depends on (Postgres + Redis) in Docker.
# Dev runs agent turns inline (eager), so no worker is required — just:
#   make up && make migrate && make seed   then   make api   (and   make web)
up:
	cd infra && docker compose up -d db redis
	@echo ""
	@echo "OK: Postgres + Redis are up. Next: make migrate && make seed, then 'make api' and 'make web'."

down:
	cd infra && docker compose down

db:
	cd infra && docker compose up -d db

db-stop:
	cd infra && docker compose down

# ── Backend ───────────────────────────────────────────────────────────────────
api:
	$(PYTHON) backend/manage.py runserver

# Optional real async worker. Dev is eager by default, so you only need this if
# you set CELERY_TASK_ALWAYS_EAGER=false. Windows requires --pool=solo.
worker:
	cd backend && .venv/Scripts/python.exe -m celery -A config worker -Q interactive,outbox --loglevel=INFO --pool=solo

migrate:
	$(PYTHON) backend/manage.py makemigrations
	$(PYTHON) backend/manage.py migrate

seed:
	$(PYTHON) backend/manage.py seed_marketplace

superuser:
	$(PYTHON) backend/manage.py createsuperuser

test:
	$(PYTHON) backend/manage.py test

check:
	$(PYTHON) backend/manage.py check

# ── Frontend ──────────────────────────────────────────────────────────────────
web:
	cd frontend && npm run dev

# ── Setup (run once) ─────────────────────────────────────────────────────────
install:
	python -m venv backend/.venv
	$(PIP) install --upgrade pip
	$(PIP) install -r backend/requirements.txt
	cd frontend && npm install
	@echo ""
	@echo "✓ .venv created at backend/.venv"
	@echo "✓ Node modules installed"
	@echo ""
	@echo "Next: copy .env.example → .env, fill in LLM_API_KEY and SECRET_KEY"
	@echo "Then: make db && make migrate && make superuser && make seed"

install-deps:
	$(PIP) install -r backend/requirements.txt
