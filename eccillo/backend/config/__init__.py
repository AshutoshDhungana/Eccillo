"""Django project package and optional Celery application export.

Celery is intentionally optional while the dependency is being rolled out.  This
keeps ordinary Django commands and the existing test environment usable before
the worker extras have been installed; production and worker processes receive
the normal ``celery_app`` export as soon as Celery is available.
"""

try:
    from .celery import app as celery_app
except ModuleNotFoundError as exc:
    if exc.name != "celery":
        raise
    celery_app = None

__all__ = ("celery_app",)
