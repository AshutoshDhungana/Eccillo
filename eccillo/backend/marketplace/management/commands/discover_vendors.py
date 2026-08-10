"""Discover real vendors/venues near a location from OpenStreetMap.

    python manage.py discover_vendors --location "Kathmandu"
    python manage.py discover_vendors --location "Austin, TX" --category venue --radius 20000
"""

import asyncio
import os

from django.core.management.base import BaseCommand

os.environ.setdefault("DJANGO_ALLOW_ASYNC_UNSAFE", "true")


class Command(BaseCommand):
    help = "Discover and persist vendors/venues near a location via OpenStreetMap."

    def add_arguments(self, parser):
        parser.add_argument("--location", required=True, help="Free-text location, e.g. 'Kathmandu'")
        parser.add_argument("--category", default=None, help="Single category; default = all supported")
        parser.add_argument("--radius", type=int, default=15000, help="Search radius in metres")

    def handle(self, *args, **opts):
        from orchestration.discovery import VendorDiscoveryService, supported_categories

        categories = [opts["category"]] if opts["category"] else supported_categories()
        service = VendorDiscoveryService(radius_m=opts["radius"], ttl_days=0)  # force fresh from CLI

        async def run():
            for cat in categories:
                result = await service.discover(location=opts["location"], category=cat)
                self.stdout.write(f"  {cat:12} -> {result}")

        asyncio.run(run())
        self.stdout.write(self.style.SUCCESS(f"Discovery complete for {opts['location']}."))
