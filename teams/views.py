from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Team
from .serializers.populated import PopulatedTeamSerializer

from lib.exceptions import exceptions

class TeamListView(APIView):
    
    @exceptions
    def get(self, request):
        teams = Team.objects.all()
        serialized_teams = PopulatedTeamSerializer(teams, many=True)
        return Response(serialized_teams.data)