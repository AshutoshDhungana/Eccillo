# Generated manually to keep the model state in sync with the supported intake types.

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("planning", "0004_event_revision"),
    ]

    operations = [
        migrations.AlterField(
            model_name="eventtemplate",
            name="type",
            field=models.CharField(
                choices=[
                    ("birthday", "Birthday"), ("wedding", "Wedding"), ("conference", "Conference"),
                    ("hackathon", "Hackathon"), ("festival", "Festival"), ("workshop", "Workshop"),
                    ("sports", "Sports"), ("meetup", "Meetup"), ("seminar", "Seminar"), ("other", "Other"),
                ],
                max_length=20,
            ),
        ),
        migrations.AlterField(
            model_name="event",
            name="type",
            field=models.CharField(
                choices=[
                    ("birthday", "Birthday"), ("wedding", "Wedding"), ("conference", "Conference"),
                    ("hackathon", "Hackathon"), ("festival", "Festival"), ("workshop", "Workshop"),
                    ("sports", "Sports"), ("meetup", "Meetup"), ("seminar", "Seminar"), ("other", "Other"),
                ],
                default="other",
                max_length=20,
            ),
        ),
    ]
