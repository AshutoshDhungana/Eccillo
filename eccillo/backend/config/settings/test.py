from .base import *

DATABASES = {"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}}
PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]

# Tests execute any future task synchronously and surface task failures rather
# than requiring Redis or a separately-running worker.
CELERY_TASK_ALWAYS_EAGER = True
CELERY_TASK_EAGER_PROPAGATES = True
GOOGLE_CALENDAR_ENABLED = False
EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"
