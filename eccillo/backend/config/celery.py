"""Celery application configuration for Eccillo background work."""

import os
from pathlib import Path

from dotenv import load_dotenv
from celery import Celery


# ``manage.py`` loads the repository .env file, but a Celery worker is started
# directly.  Loading it here preserves the same local-development behaviour;
# deployed environments still take precedence through real environment values.
load_dotenv(Path(__file__).resolve().parent.parent.parent / ".env")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")

app = Celery("eccillo")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
