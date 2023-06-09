# Generated by Django 4.2 on 2023-04-16 16:28

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Team',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('abb', models.CharField(max_length=4)),
                ('shirt_image', models.URLField(validators=[django.core.validators.URLValidator()])),
                ('next_match', models.CharField(max_length=8)),
            ],
        ),
    ]
