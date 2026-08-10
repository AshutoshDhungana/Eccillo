from django.urls import path
from . import views

urlpatterns = [
    path("events", views.events_list),
    path("events/<uuid:event_id>", views.event_detail),
    path("events/slug/<slug:slug>", views.event_by_slug),
    path("events/<uuid:event_id>/milestones", views.milestones),
    path("events/<uuid:event_id>/tasks", views.tasks),
    path("events/<uuid:event_id>/budget", views.budget),
    path("events/<uuid:event_id>/risks", views.risks),
    path("events/<uuid:event_id>/seating", views.seating),
    path("events/<uuid:event_id>/comments", views.comments),
    path("events/<uuid:event_id>/milestones/<uuid:item_id>", views.milestone_detail),
    path("events/<uuid:event_id>/tasks/<uuid:item_id>", views.task_detail),
    path("events/<uuid:event_id>/risks/<uuid:item_id>", views.risk_detail),
    path("events/<uuid:event_id>/budget/line-items/<uuid:item_id>", views.budget_line_item_detail),
]
