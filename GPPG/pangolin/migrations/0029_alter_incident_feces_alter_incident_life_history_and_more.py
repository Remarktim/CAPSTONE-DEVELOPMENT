# Generated by Django 5.1.3 on 2024-11-20 13:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pangolin', '0028_remove_incidentreport_feces_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='incident',
            name='feces',
            field=models.CharField(blank=True, choices=[('Yes', 'Yes'), ('No', 'No')], max_length=150, null=True),
        ),
        migrations.AlterField(
            model_name='incident',
            name='life_history',
            field=models.CharField(blank=True, max_length=250, null=True),
        ),
        migrations.AlterField(
            model_name='incident',
            name='obl_rolled',
            field=models.CharField(blank=True, max_length=250, null=True),
        ),
        migrations.AlterField(
            model_name='incident',
            name='obl_stretched',
            field=models.CharField(blank=True, max_length=250, null=True),
        ),
        migrations.AlterField(
            model_name='incident',
            name='sex',
            field=models.CharField(blank=True, choices=[('Male', 'Male'), ('Female', 'Female')], max_length=150, null=True),
        ),
        migrations.AlterField(
            model_name='incident',
            name='ticks',
            field=models.CharField(blank=True, choices=[('Yes', 'Yes'), ('No', 'No')], max_length=150, null=True),
        ),
    ]