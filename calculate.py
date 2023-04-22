import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
django.setup()

from info.models import Info
from players.models import Player

def update_points():
    infos = Info.objects.all()

    for info in infos:
        total_gw_points = sum(player.gw_points for player in info.selected_players.all())
        info.gw_points = total_gw_points
        info.total_points += total_gw_points
        info.save()

if __name__ == '__main__':
    update_points()
    print("Points updated successfully.")