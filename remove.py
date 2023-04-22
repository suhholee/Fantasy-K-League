import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
django.setup()

from players.models import Player

def remove_points():

    Player.objects.update(gw_points=0)

if __name__ == '__main__':
    remove_points()
    print("Points reset successfully.")