# Generated by Django 5.1.1 on 2024-10-21 15:57

import pangolin.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pangolin', '0020_alter_user_contact'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='contact',
            field=models.CharField(max_length=11, validators=[pangolin.models.validate_contact]),
        ),
    ]
