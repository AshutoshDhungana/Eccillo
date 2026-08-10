from django.urls import path

from . import views

urlpatterns = [
    path("events/<uuid:event_id>/agent/sessions", views.agent_sessions),
    path("events/<uuid:event_id>/agent/sessions/<uuid:session_id>/messages", views.agent_transcript),
    path("events/<uuid:event_id>/agent/messages", views.agent_messages),
    path("events/<uuid:event_id>/agent/sessions/<uuid:session_id>/approve", views.agent_approve),
    path("events/<uuid:event_id>/agent/runs/<uuid:run_id>", views.agent_run_detail),
    path("events/<uuid:event_id>/agent/state", views.agent_state),
    path("events/<uuid:event_id>/agent/plan/approve", views.agent_plan_approve),
    path("events/<uuid:event_id>/agent/vendors", views.agent_vendors),
    path("events/<uuid:event_id>/agent/shortlist", views.agent_shortlist),
]
