# Generated by Django 5.1 on 2024-11-24 15:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pangolin', '0030_incident_weight'),
    ]

    operations = [
        migrations.AddField(
            model_name='officer',
            name='is_latest',
            field=models.BooleanField(default=False),
        ),
    ]