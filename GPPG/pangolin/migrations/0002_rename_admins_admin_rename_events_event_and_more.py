# Generated by Django 5.0.3 on 2024-09-10 14:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('pangolin', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Admins',
            new_name='Admin',
        ),
        migrations.RenameModel(
            old_name='Events',
            new_name='Event',
        ),
        migrations.RenameModel(
            old_name='Evidences',
            new_name='Evidence',
        ),
        migrations.RenameModel(
            old_name='Incidents',
            new_name='Incident',
        ),
        migrations.RenameModel(
            old_name='Officers',
            new_name='Officer',
        ),
    ]