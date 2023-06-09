# Generated by Django 4.2 on 2023-04-16 17:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('teams', '0005_remove_team_player'),
        ('players', '0003_player_team'),
    ]

    operations = [
        migrations.AlterField(
            model_name='player',
            name='team',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='players', to='teams.team'),
        ),
    ]
