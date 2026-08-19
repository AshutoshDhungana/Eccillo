import os
from pathlib import Path
from corsheaders.defaults import default_headers

BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key-change-in-prod")

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.postgres",
    # third-party
    "rest_framework",
    "corsheaders",
    # cross-cutting
    "common",
    "accounts",
    "planning.apps.PlanningConfig",
    # marketplace + AI orchestration (Phase 3)
    "marketplace.apps.MarketplaceConfig",
    "orchestration.apps.OrchestrationConfig",
    "procurement.apps.ProcurementConfig",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("DB_NAME", "eccillo"),
        "USER": os.environ.get("DB_USER", "eccillo"),
        "PASSWORD": os.environ.get("DB_PASSWORD", "eccillo"),
        "HOST": os.environ.get("DB_HOST", "localhost"),
        "PORT": os.environ.get("DB_PORT", "5432"),
    }
}

AUTH_USER_MODEL = "accounts.User"

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kathmandu"
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "mediafiles"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "common.auth.EccilloJWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ],
    "DEFAULT_PAGINATION_CLASS": "common.pagination.EccilloCursorPagination",
    "PAGE_SIZE": 25,
    "EXCEPTION_HANDLER": "common.api.problem_exception_handler",
    # Only the public procurement reply page opts into throttling today; the
    # rate is here because DRF reads scopes from settings, not the decorator.
    "DEFAULT_THROTTLE_RATES": {"anon": "30/hour"},
}

# Browser clients use these two optimistic-concurrency/retry headers for
# authenticated writes. Keep this explicit for direct API deployments; Vite's
# local proxy does not require CORS at all.
CORS_ALLOW_HEADERS = [*default_headers, "idempotency-key", "if-match"]

def _env_bool(name: str, default: bool = False) -> bool:
    """Read a conservative boolean feature/config flag from the environment."""
    value = os.environ.get(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _env_positive_int(name: str, default: int) -> int:
    try:
        return max(1, int(os.environ.get(name, default)))
    except (TypeError, ValueError):
        return default


DOCUMENT_UPLOAD_MAX_BYTES = _env_positive_int("DOCUMENT_UPLOAD_MAX_BYTES", 25 * 1024 * 1024)

# --- Outbound mail (procurement outreach) ---
# SMTP is the default here on purpose: dev overrides it with the console backend
# and tests with locmem. Defaulting to console *here* would make a production
# deploy that forgets EMAIL_HOST silently drop every message instead of failing.
EMAIL_HOST = os.environ.get("EMAIL_HOST", "")
EMAIL_PORT = _env_positive_int("EMAIL_PORT", 587)
# Without this an unresponsive SMTP host blocks the sender forever.
EMAIL_TIMEOUT = _env_positive_int("EMAIL_TIMEOUT", 10)
EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD", "")
EMAIL_USE_TLS = _env_bool("EMAIL_USE_TLS", True)
DEFAULT_FROM_EMAIL = os.environ.get("DEFAULT_FROM_EMAIL", "Eccillo <no-reply@eccillo.dev>")

# Public base URL for links we put in outbound mail (the vendor reply page).
# Must be reachable by the recipient, so it is the web app's origin, not the API.
PUBLIC_WEB_URL = os.environ.get("PUBLIC_WEB_URL", "http://localhost:5173").rstrip("/")

# --- Celery (async agent turns) ---
CELERY_BROKER_URL = os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379/0")
CELERY_RESULT_BACKEND = os.environ.get("CELERY_RESULT_BACKEND", "redis://localhost:6379/1")
# When true, tasks run inline in the caller (no broker/worker needed). Handy for
# local dev without Redis; tests force this on in config/settings/test.py.
CELERY_TASK_ALWAYS_EAGER = _env_bool("CELERY_TASK_ALWAYS_EAGER", False)
CELERY_TASK_EAGER_PROPAGATES = True
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_ACCEPT_CONTENT = ["json"]
# Route agent tasks onto the existing queue-isolated workers (see infra compose).
CELERY_TASK_ROUTES = {
    "orchestration.run_agent_turn": {"queue": "interactive"},
    "orchestration.dispatch_outbox": {"queue": "outbox"},
    # No compose worker consumes the default "celery" queue, so an unrouted
    # task is enqueued and never picked up.
    "procurement.send_outreach_batch": {"queue": "outbox"},
}

# Toggle live OSM venue/vendor discovery during agent turns.
AGENT_DISCOVERY_ENABLED = _env_bool("AGENT_DISCOVERY_ENABLED", True)


def _env_nonnegative_int(name: str, default: int) -> int:
    try:
        return max(0, int(os.environ.get(name, default)))
    except (TypeError, ValueError):
        return default

