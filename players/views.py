from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Player
from .serializers.populated import PopulatedPlayerSerializer

from lib.exceptions import exceptions

class PlayerListView(APIView):
    
    @exceptions
    def get(self, request):
        players = Player.objects.all()
        serialized_players = PopulatedPlayerSerializer(players, many=True)
        return Response(serialized_players.data)