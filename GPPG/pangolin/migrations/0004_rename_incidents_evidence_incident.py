# Generated by Django 5.0.3 on 2024-09-19 09:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('pangolin', '0003_event_officer'),
    ]

    operations = [
        migrations.RenameField(
            model_name='evidence',
            old_name='incidents',
            new_name='incident',
        ),
    ]