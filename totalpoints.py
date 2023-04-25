import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
django.setup()

from info.models import Info
from players.models import Player

def update_points():
    infos = Info.objects.all()

    for info in infos:
        info.total_points += info.gw_points
        info.save()

if __name__ == '__main__':
    update_points()
    print("Total points updated successfully.")