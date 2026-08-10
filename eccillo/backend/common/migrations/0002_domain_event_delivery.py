# Generated manually for the durable transactional outbox.

from django.db import migrations, models


def mark_existing_published_events_delivered(apps, schema_editor):
    DomainEvent = apps.get_model("common", "DomainEvent")
    DomainEvent.objects.filter(published_at__isnull=False).update(delivery_status="delivered")


class Migration(migrations.Migration):

    dependencies = [
        ("common", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="domainevent",
            name="attempts",
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name="domainevent",
            name="dedupe_key",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name="domainevent",
            name="delivery_status",
            field=models.CharField(
                choices=[
                    ("pending", "Pending"),
                    ("delivering", "Delivering"),
                    ("failed", "Failed"),
                    ("delivered", "Delivered"),
                    ("dead_letter", "Dead letter"),
                ],
                default="pending",
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="domainevent",
            name="last_attempt_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="domainevent",
            name="last_error",
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name="domainevent",
            name="lease_expires_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="domainevent",
            name="lease_owner",
            field=models.CharField(blank=True, max_length=160),
        ),
        migrations.AddField(
            model_name="domainevent",
            name="next_attempt_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="domainevent",
            name="schema_version",
            field=models.PositiveSmallIntegerField(default=1),
        ),
        migrations.RunPython(mark_existing_published_events_delivered, migrations.RunPython.noop),
        migrations.AddIndex(
            model_name="domainevent",
            index=models.Index(
                fields=["delivery_status", "next_attempt_at", "created_at"],
                name="common_doma_deliver_712589_idx",
            ),
        ),
        migrations.AddConstraint(
            model_name="domainevent",
            constraint=models.UniqueConstraint(
                condition=models.Q(("dedupe_key__isnull", False)),
                fields=("organization", "dedupe_key"),
                name="unique_domain_event_dedupe_key",
            ),
        ),
    ]
