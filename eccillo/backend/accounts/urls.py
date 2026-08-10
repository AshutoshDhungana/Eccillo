from django.urls import path
from . import views

urlpatterns = [
    path("auth/register", views.register),
    path("auth/login", views.login_view),
    path("auth/logout", views.logout_view),
    path("auth/refresh", views.refresh),
    path("auth/switch-organization", views.switch_organization),
    path("me", views.me),
    path("organizations", views.create_organization),
    path("organizations/<uuid:organization_id>/members", views.organization_members),
]
