from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("planning", "0002_eventtemplate_alter_task_options_and_more")]

    operations = [
        migrations.AddField(
            model_name="event",
            name="revision",
            field=models.PositiveIntegerField(default=0),
        ),
    ]
