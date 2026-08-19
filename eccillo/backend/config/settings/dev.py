from .base import *

DEBUG = True

ALLOWED_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0"]

CORS_ALLOWED_ORIGINS = os.environ.get(
    "CORS_ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173",
).split(",")

CORS_ALLOW_CREDENTIALS = True

# Outreach prints to the runserver log unless you point EMAIL_HOST at real SMTP,
# so the whole procurement flow works on a bare checkout with no mail account.
if not EMAIL_HOST:
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# In local dev, run agent turns inline (no Celery worker needed) unless you
# explicitly opt into the async worker with CELERY_TASK_ALWAYS_EAGER=false.
CELERY_TASK_ALWAYS_EAGER = os.environ.get("CELERY_TASK_ALWAYS_EAGER", "true").strip().lower() in {"1", "true", "yes", "on"}
