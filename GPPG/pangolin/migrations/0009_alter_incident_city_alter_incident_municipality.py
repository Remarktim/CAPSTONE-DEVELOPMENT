# Generated by Django 5.1.1 on 2024-09-29 08:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pangolin', '0008_alter_evidence_evidence_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='incident',
            name='city',
            field=models.CharField(blank=True, max_length=150, null=True),
        ),
        migrations.AlterField(
            model_name='incident',
            name='municipality',
            field=models.CharField(blank=True, max_length=150, null=True),
        ),
    ]