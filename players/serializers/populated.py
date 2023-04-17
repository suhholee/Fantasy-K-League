from .common import PlayerSerializer
from teams.serializers.common import TeamSerializer

class PopulatedPlayerSerializer(PlayerSerializer):
    team = TeamSerializer()