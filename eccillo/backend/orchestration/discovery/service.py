"""VendorDiscoveryService — geocode + Overpass + persist into the marketplace.

Discovered POIs are upserted into ``marketplace.Vendor`` (deduped by
``external_ref``) so the platform's scoring, shortlisting, and reviews all work
on them unchanged.  A ``VendorDiscoveryLog`` gives a TTL cache so repeated turns
for the same location/category don't re-hit the public OSM endpoints.
"""

from __future__ import annotations

import logging
from datetime import timedelta

from django.utils import timezone

from . import osm

logger = logging.getLogger("eccillo.discovery")


class VendorDiscoveryService:
    def __init__(self, *, radius_m: int = 15000, limit: int = 25, ttl_days: int = 7):
        self.radius_m = radius_m
        self.limit = limit
        self.ttl = timedelta(days=ttl_days)

    def is_fresh(self, location: str, category: str) -> bool:
        from marketplace.models import VendorDiscoveryLog

        cutoff = timezone.now() - self.ttl
        return VendorDiscoveryLog.objects.filter(
            location__iexact=location.strip(), category=category, created_at__gte=cutoff
        ).exists()

    async def discover(self, *, location: str, category: str) -> dict:
        """Discover + persist vendors for one location/category. Never raises."""
        location = (location or "").strip()
        tags = osm.CATEGORY_TAGS.get(category)
        if not location or not tags:
            return {"skipped": True, "reason": "unsupported category or missing location"}
        if self.is_fresh(location, category):
            return {"skipped": True, "reason": "cache_fresh"}

        latlon = await osm.geocode(location)
        if latlon is None:
            self._log(location, category, None, 0, 0)
            return {"skipped": True, "reason": "geocode_failed"}
        lat, lon = latlon

        elements = await osm.overpass(lat, lon, tags, radius_m=self.radius_m, limit=self.limit)
        created = self._persist(elements, category=category, location=location)
        self._log(location, category, latlon, len(elements), created)
        return {"location": location, "category": category, "found": len(elements), "created": created}

    # -- sync ORM (runs under DJANGO_ALLOW_ASYNC_UNSAFE inside the turn) ------
    def _persist(self, elements: list[dict], *, category: str, location: str) -> int:
        from marketplace.models import ServiceListing, Vendor

        created = 0
        for el in elements:
            fields = osm.normalize(el, category=category, location=location)
            if not fields:
                continue
            ref = fields["external_ref"]
            vendor, is_new = Vendor.objects.get_or_create(
                external_source="osm", external_ref=ref, defaults=fields
            )
            if is_new:
                ServiceListing.objects.create(
                    vendor=vendor, category=category, title=vendor.display_name, price_from_minor=0
                )
                created += 1
            else:
                # Merge fresh contact info / coordinates without wiping curation.
                for key in ("contact_phone", "website", "latitude", "longitude"):
                    if not getattr(vendor, key) and fields.get(key):
                        setattr(vendor, key, fields[key])
                areas = set(vendor.service_areas or [])
                if location not in areas:
                    vendor.service_areas = [*vendor.service_areas, location]
                vendor.save()
        return created

    def _log(self, location, category, latlon, found, created) -> None:
        from marketplace.models import VendorDiscoveryLog

        VendorDiscoveryLog.objects.create(
            location=location,
            category=category,
            latitude=latlon[0] if latlon else None,
            longitude=latlon[1] if latlon else None,
            radius_m=self.radius_m,
            found=found,
            created_count=created,
        )
