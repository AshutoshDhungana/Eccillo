from django.urls import path

from . import views

urlpatterns = [
    path("events/<uuid:event_id>/procurement/requests", views.procurement_requests),
    path("events/<uuid:event_id>/procurement/requests/<uuid:request_id>", views.procurement_request_detail),
    path("events/<uuid:event_id>/procurement/requests/<uuid:request_id>/send", views.procurement_request_send),
    path("events/<uuid:event_id>/procurement/leads", views.procurement_leads),
    # Public, unauthenticated: the counterparty answers here.
    path("procurement/respond/<str:token>", views.outreach_respond),
]
