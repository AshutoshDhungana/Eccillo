from django.contrib import admin

from .models import AvailabilityHold, EventVendorShortlist, Review, ServiceListing, Vendor


@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display = ("display_name", "category", "rating_avg", "review_count", "verification_status")
    list_filter = ("category", "verification_status")
    search_fields = ("display_name", "legal_name")


admin.site.register(ServiceListing)
admin.site.register(AvailabilityHold)
admin.site.register(EventVendorShortlist)
admin.site.register(Review)
