# Generated by Django 5.1.1 on 2024-10-19 15:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pangolin', '0017_officer_fb_url_officer_ig_url'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='event',
            name='officers',
        ),
        migrations.AddField(
            model_name='event',
            name='event_image',
            field=models.ImageField(blank=True, null=True, upload_to='activities/'),
        ),
    ]