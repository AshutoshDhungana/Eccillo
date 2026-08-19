"""Celery wrapper around the outreach sender.

Kept as a one-liner so ``procurement/services.py`` stays importable — and the
whole flow stays testable — without Celery installed.
"""

from celery import shared_task


@shared_task(name="procurement.send_outreach_batch")
def send_outreach_batch(request_id: str) -> dict:
    from .services import send_queued_outreach

    return send_queued_outreach(request_id)
