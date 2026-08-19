from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include("accounts.urls")),
    path("api/v1/", include("common.urls")),
    path("api/v1/", include("planning.urls")),
    path("api/v1/", include("orchestration.urls")),
    path("api/v1/", include("procurement.urls")),
]
