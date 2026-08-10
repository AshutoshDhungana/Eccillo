# Eccillo — Event Management App

Create events, manage schedules, assign tasks, track budgets, and record risks in one focused workspace.

## Quick start

```bash
cp .env.example .env
make db
make install
make migrate
make superuser
make api
make web
```

## Stack

- Backend: Django + Django REST Framework
- Database: PostgreSQL
- Frontend: React + TypeScript + Vite

## Core features

- Manual event creation and editing
- Milestones, tasks, budgets, and risk tracking
- Calendar view for dated work
