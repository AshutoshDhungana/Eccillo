"""Seed vendors + service listings from ``seeds/vendors.json``.

Idempotent: re-running updates nothing already present (get_or_create keyed on
display_name).  Decoupled from any demo-event seeding so it can run standalone.
"""

import json
import pathlib

from django.core.management.base import BaseCommand

from marketplace.models import ServiceListing, Vendor

SEEDS_DIR = pathlib.Path(__file__).resolve().parents[4] / "seeds"


class Command(BaseCommand):
    help = "Load vendor seed data into the marketplace."

    def handle(self, *args, **options):
        vendors_file = SEEDS_DIR / "vendors.json"
        if not vendors_file.exists():
            self.stderr.write(self.style.ERROR(f"Seed file not found: {vendors_file}"))
            return
        data = json.loads(vendors_file.read_text(encoding="utf-8"))
        created = 0
        for v in data:
            vendor, is_new = Vendor.objects.get_or_create(
                display_name=v["display_name"],
                defaults={
                    "category": v["category"],
                    "description": v.get("description", ""),
                    "service_areas": v.get("service_areas", ["Kathmandu"]),
                    "rating_avg": v.get("rating_avg", 4.0),
                    "review_count": v.get("review_count", 0),
                    "response_time_mins": v.get("response_time_mins", 120),
                    "price_from_minor": v.get("price_from_minor", 0),
                    "price_to_minor": v.get("price_to_minor", 0),
                    "currency": v.get("currency", "NPR"),
                    "contact_phone": v.get("contact_phone", ""),
                    "verification_status": "verified",
                },
            )
            if is_new:
                ServiceListing.objects.create(
                    vendor=vendor,
                    category=v["category"],
                    title=v.get("listing_title", vendor.display_name),
                    description=v.get("description", ""),
                    pricing_model=v.get("pricing_model", "flat"),
                    price_from_minor=v.get("price_from_minor", 0),
                    capacity_min=v.get("capacity_min"),
                    capacity_max=v.get("capacity_max"),
                )
                created += 1
        self.stdout.write(self.style.SUCCESS(f"Seeded {created} new vendors ({len(data)} in file)."))
