from .common import TeamSerializer
from players.serializers.common import PlayerSerializer

class PopulatedTeamSerializer(TeamSerializer):
    players = PlayerSerializer(many=True)