# Generated by Django 4.2 on 2023-04-16 12:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_remove_user_shirt_image_user_budget'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='budget',
        ),
    ]
