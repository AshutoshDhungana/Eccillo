"""Deliver pending transactional-outbox events once (cron/beat-friendly).

    python manage.py dispatch_outbox

Runs the same logic as the ``orchestration.dispatch_outbox`` Celery task, but
synchronously — useful in dev without a worker, or as a periodic safety sweep.
"""

from django.core.management.base import BaseCommand

from orchestration.tasks import dispatch_outbox


class Command(BaseCommand):
    help = "Deliver pending outbox (DomainEvent) records."

    def add_arguments(self, parser):
        parser.add_argument("--limit", type=int, default=500)

    def handle(self, *args, **opts):
        delivered = dispatch_outbox(limit=opts["limit"])
        self.stdout.write(self.style.SUCCESS(f"Delivered {delivered} outbox event(s)."))
