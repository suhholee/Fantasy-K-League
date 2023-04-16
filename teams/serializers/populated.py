from .common import TeamSerializer
from players.serializers.common import PlayerSerializer # no . at the start of a path will look from root dir

class PopulatedTeamSerializer(TeamSerializer):
    players = PlayerSerializer(many=True)