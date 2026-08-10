from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [("planning", "0006_add_birthday_event_type")]

    operations = [
        migrations.RemoveField(model_name="budgetlineitem", name="linked_ref_id"),
        migrations.RemoveField(model_name="budgetlineitem", name="linked_ref_type"),
    ]
