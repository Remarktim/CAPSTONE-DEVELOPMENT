# Generated by Django 5.1.3 on 2024-11-20 14:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pangolin', '0029_alter_incident_feces_alter_incident_life_history_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='incident',
            name='weight',
            field=models.CharField(blank=True, max_length=250, null=True),
        ),
    ]
