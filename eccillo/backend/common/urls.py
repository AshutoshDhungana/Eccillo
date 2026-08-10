from django.urls import path
from . import views
urlpatterns=[path("approvals",views.create_approval),path("approvals/<uuid:chain_id>/decide",views.decide_approval),path("notifications",views.notifications)]
