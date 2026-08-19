from django.contrib import admin

from .models import Outreach, ProcurementRequest


@admin.register(ProcurementRequest)
class ProcurementRequestAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "status", "event", "created_at")
    list_filter = ("status", "category")
    search_fields = ("title", "event__title")


@admin.register(Outreach)
class OutreachAdmin(admin.ModelAdmin):
    list_display = ("party_name", "request", "status", "quote_minor", "sent_at", "responded_at")
    list_filter = ("status", "party_type")
    search_fields = ("party_name", "to_email")
    # The token is the only credential on the public reply page.
    readonly_fields = ("token",)
