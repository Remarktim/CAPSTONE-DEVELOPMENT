# Generated by Django 5.1.1 on 2024-11-07 11:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pangolin', '0021_alter_user_contact'),
    ]

    operations = [
        migrations.AlterField(
            model_name='officer',
            name='position',
            field=models.CharField(choices=[('President', 'President'), ('Vice President', 'Vice President'), ('Secretary', 'Secretary'), ('Treasurer', 'Treasurer'), ('Auditor', 'Auditor'), ('Pio Internal', 'Pio Internal'), ('Pio External', 'Pio External'), ('Business Manager', 'Business Manager')], max_length=150),
        ),
    ]
