# Generated by Django 5.1.3 on 2024-11-17 13:42

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pangolin', '0025_rename_email_user_user_email_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='incidentreport',
            name='admin',
        ),
        migrations.RemoveField(
            model_name='incidentreport',
            name='evidence',
        ),
        migrations.RemoveField(
            model_name='incidentreport',
            name='incident',
        ),
        migrations.AddField(
            model_name='incidentreport',
            name='description',
            field=models.CharField(default=django.utils.timezone.now, max_length=250),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='incidentreport',
            name='municity',
            field=models.CharField(blank=True, choices=[('Aborlan', 'Aborlan'), ('Agutaya', 'Agutaya'), ('Araceli', 'Araceli'), ('Balabac', 'Balabac'), ('Bataraza', 'Bataraza'), ("Brooke's Point", "Brooke's Point"), ('Busuanga', 'Busuanga'), ('Cagayancillo', 'Cagayancillo'), ('Coron', 'Coron'), ('Culion', 'Culion'), ('Cuyo', 'Cuyo'), ('Dumaran', 'Dumaran'), ('El Nido', 'El Nido'), ('Kalayaan', 'Kalayaan'), ('Linapacan', 'Linapacan'), ('Magsaysay', 'Magsaysay'), ('Narra', 'Narra'), ('Puerto Princesa City', 'Puerto Princesa City'), ('Quezon', 'Quezon'), ('Rizal', 'Rizal'), ('Roxas', 'Roxas'), ('San Vicente', 'San Vicente'), ('Sofronio Española', 'Sofronio Española'), ('Taytay', 'Taytay')], max_length=150, null=True),
        ),
        migrations.AddField(
            model_name='incidentreport',
            name='status',
            field=models.CharField(choices=[('Alive', 'Alive'), ('Dead', 'Dead'), ('Scales', 'Scales'), ('Illegal Trade', 'Illegal Trade')], default=django.utils.timezone.now, max_length=150),
            preserve_default=False,
        ),
    ]
