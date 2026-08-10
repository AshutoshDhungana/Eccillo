"""Location-based supplier discovery (OpenStreetMap-backed, pluggable)."""

from .osm import CATEGORY_TAGS, supported_categories
from .service import VendorDiscoveryService

__all__ = ["VendorDiscoveryService", "CATEGORY_TAGS", "supported_categories"]
