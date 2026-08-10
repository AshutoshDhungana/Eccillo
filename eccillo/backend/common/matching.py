"""Explainable deterministic scoring shared by all marketplace pillars."""
from datetime import date

def _clamp(value): return round(max(0.0, min(1.0, float(value))), 3)

def vendor_score(vendor, constraints):
    budget = constraints.get("budget_max") or constraints.get("budget_max_minor")
    factors = {"budget": 1 if not budget else _clamp(1 - max(0, vendor.price_from_minor - int(budget)) / max(int(budget), 1)), "reviews": _clamp(float(vendor.rating_avg) / 5), "response_time": _clamp(1 - vendor.response_time_mins / 2880), "experience": _clamp(min(vendor.review_count, 20) / 20), "availability": 1.0}
    if constraints.get("date"):
        requested = date.fromisoformat(str(constraints["date"]))
        factors["availability"] = 0.0 if vendor.availability_holds.filter(starts_at__date__lte=requested, ends_at__date__gte=requested, status__in=["tentative", "confirmed"]).exists() else 1.0
    weights = {"budget": .3, "reviews": .25, "response_time": .1, "experience": .2, "availability": .15}
    return _clamp(sum(factors[k] * weights[k] for k in weights)), factors
