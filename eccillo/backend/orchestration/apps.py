from django.apps import AppConfig


class OrchestrationConfig(AppConfig):
    """AI orchestration integration layer.

    This app is the *only* place the ``agent`` package is wired into Django.  It
    implements the agent's abstract ports against real backend services, persists
    conversation/run state, and exposes the Conversation API.  ``agent`` keeps
    zero Django imports, so anything needing the ORM belongs here (see README).
    """

    default_auto_field = "django.db.models.BigAutoField"
    name = "orchestration"
    verbose_name = "AI Orchestration"
