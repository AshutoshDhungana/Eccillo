"""OpenStreetMap discovery: Nominatim geocoding + Overpass POI queries.

Open data, no API key.  Designed to be *non-fatal*: any network/parse failure
returns empty rather than breaking a planning turn.  Respects provider etiquette
with a descriptive User-Agent, short timeouts, and mirror fallback; callers cache
results (see ``VendorDiscoveryLog``) so we never hammer the public endpoints.

For production scale, self-host Overpass/Nominatim or use a commercial endpoint
and set the URLs via ``OSM_*`` settings.
"""

from __future__ import annotations

import logging
from typing import Any

import httpx

logger = logging.getLogger("eccillo.discovery")

USER_AGENT = "eccillo-event-os/0.1 (+https://eccillo.dev; event planning discovery)"
NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
OVERPASS_ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
]

# Our vendor categories → OSM tag filters (key, value). Talent/sponsor are
# intentionally absent (not modelled in OSM — see Phase 3 decision).
CATEGORY_TAGS: dict[str, list[tuple[str, str]]] = {
    "venue": [
        ("amenity", "events_venue"),
        ("amenity", "conference_centre"),
        ("amenity", "exhibition_centre"),
        ("amenity", "community_centre"),
        ("tourism", "hotel"),
    ],
    "catering": [("amenity", "restaurant"), ("shop", "caterer"), ("craft", "caterer")],
    "hotel": [("tourism", "hotel"), ("tourism", "guest_house")],
    "photography": [("shop", "photo"), ("craft", "photographer")],
    "videography": [("craft", "photographer")],
    "printing": [("shop", "copyshop"), ("shop", "printing"), ("craft", "printer")],
    "decoration": [("shop", "florist"), ("shop", "interior_decoration")],
    "security": [("office", "security")],
    "av": [("shop", "hifi"), ("shop", "electronics")],
    "transport": [("amenity", "car_rental"), ("shop", "car_rental")],
    "merchandise": [("shop", "gift")],
}


def supported_categories() -> list[str]:
    return sorted(CATEGORY_TAGS)


async def geocode(location: str, *, timeout: float = 20.0) -> tuple[float, float] | None:
    """Resolve a free-text location to (lat, lon) via Nominatim. None on failure."""
    if not location:
        return None
    try:
        async with httpx.AsyncClient(timeout=timeout, headers={"User-Agent": USER_AGENT}) as client:
            resp = await client.get(NOMINATIM_URL, params={"q": location, "format": "json", "limit": 1})
            resp.raise_for_status()
            rows = resp.json()
            if not rows:
                return None
            return float(rows[0]["lat"]), float(rows[0]["lon"])
    except Exception as exc:  # noqa: BLE001 - discovery must never break a turn
        logger.warning("geocode failed for %r: %s", location, exc)
        return None


def _build_query(lat: float, lon: float, tags: list[tuple[str, str]], radius_m: int, limit: int) -> str:
    clauses = "".join(
        f'node["{k}"="{v}"](around:{radius_m},{lat},{lon});way["{k}"="{v}"](around:{radius_m},{lat},{lon});'
        for k, v in tags
    )
    return f"[out:json][timeout:25];({clauses});out center {limit};"


async def overpass(lat: float, lon: float, tags: list[tuple[str, str]], *, radius_m: int = 15000, limit: int = 25, timeout: float = 60.0) -> list[dict[str, Any]]:
    """Run an Overpass query with mirror fallback. Returns raw elements (may be empty)."""
    query = _build_query(lat, lon, tags, radius_m, limit)
    async with httpx.AsyncClient(timeout=timeout, headers={"User-Agent": USER_AGENT}) as client:
        for endpoint in OVERPASS_ENDPOINTS:
            try:
                resp = await client.post(endpoint, data={"data": query})
                if resp.status_code != 200 or not resp.headers.get("content-type", "").startswith("application/json"):
                    continue
                return resp.json().get("elements", [])
            except Exception as exc:  # noqa: BLE001 - try the next mirror
                logger.warning("overpass %s failed: %s", endpoint, exc)
                continue
    return []


def normalize(element: dict[str, Any], *, category: str, location: str) -> dict[str, Any] | None:
    """Turn an Overpass element into Vendor-shaped fields. None if unusable (no name)."""
    tags = element.get("tags", {})
    name = tags.get("name")
    if not name:
        return None
    lat = element.get("lat") or (element.get("center") or {}).get("lat")
    lon = element.get("lon") or (element.get("center") or {}).get("lon")
    return {
        "display_name": name[:255],
        "category": category,
        "description": tags.get("description", "")[:2000],
        "service_areas": [location],
        "contact_phone": (tags.get("phone") or tags.get("contact:phone") or "")[:20],
        "website": (tags.get("website") or tags.get("contact:website") or "")[:200],
        "latitude": lat,
        "longitude": lon,
        "external_source": "osm",
        "external_ref": f"{element.get('type')}/{element.get('id')}",
        # Unknown-but-honest defaults so scoring doesn't over-credit unrated POIs.
        "rating_avg": 0,
        "review_count": 0,
        "response_time_mins": 1440,
        "verification_status": "unverified",
    }
