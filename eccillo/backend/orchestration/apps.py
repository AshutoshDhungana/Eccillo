from django.apps import AppConfig


class OrchestrationConfig(AppConfig):
    """AI orchestration integration layer.

    This app is the *only* place the frozen ``agent`` package is wired into
    Django.  It implements the agent's abstract ports against real backend
    services, persists conversation/run state, and exposes the Conversation API.
    The ``agent`` package itself is never modified (see ``contracts.md``).
    """

    default_auto_field = "django.db.models.BigAutoField"
    name = "orchestration"
    verbose_name = "AI Orchestration"
