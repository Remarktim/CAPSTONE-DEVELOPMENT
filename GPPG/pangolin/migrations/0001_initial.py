# Generated by Django 5.0.3 on 2024-09-10 13:37

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Admins',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('username', models.CharField(max_length=250)),
                ('password', models.CharField(max_length=500)),
                ('email', models.CharField(max_length=150)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Events',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=150)),
                ('description', models.CharField(max_length=150)),
                ('date', models.DateField()),
                ('location', models.CharField(max_length=150)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Evidences',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('evidence_type', models.CharField(max_length=150)),
                ('file_path', models.CharField(max_length=150)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Incidents',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('municipality', models.CharField(max_length=150)),
                ('city', models.CharField(max_length=150)),
                ('status', models.CharField(choices=[('Alive', 'Alive'), ('Dead', 'Dead'), ('Scales', 'Scales'), ('Illegal Trade', 'Illegal Trade')], max_length=150)),
                ('description', models.CharField(max_length=250)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Officers',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('first_name', models.CharField(max_length=150)),
                ('last_name', models.CharField(max_length=150)),
                ('date_joined', models.DateField()),
                ('position', models.CharField(max_length=150)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='IncidentReport',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('date_joined', models.DateField()),
                ('admin', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pangolin.admins')),
                ('evidence', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pangolin.evidences')),
                ('incident', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pangolin.incidents')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='evidences',
            name='incidents',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pangolin.incidents'),
        ),
    ]