from .common import InfoSerializer
from players.serializers.common import PlayerSerializer

class PopulatedInfoSerializer(InfoSerializer):
    selected_players = PlayerSerializer(many=True)