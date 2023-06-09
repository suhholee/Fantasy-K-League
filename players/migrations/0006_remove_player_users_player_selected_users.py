# Generated by Django 4.2 on 2023-04-16 17:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('info', '0002_info_user'),
        ('players', '0005_player_users'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='player',
            name='users',
        ),
        migrations.AddField(
            model_name='player',
            name='selected_users',
            field=models.ManyToManyField(related_name='selected_players', to='info.info'),
        ),
    ]
