from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Info
from .serializers.common import InfoSerializer

from rest_framework.permissions import IsAuthenticatedOrReadOnly

from lib.exceptions import exceptions

# Create your views here.
class InfoListView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)

    # GET ALL INFO
    # Endpoint: GET /api/info/
    @exceptions
    def get(self, request):
        info = Info.objects.all()
        serialized_info = InfoSerializer(info, many=True)
        return Response(serialized_info.data)
    

class InfoDetailView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)

    # GET SINGLE INFO
    # Endpoint: GET /api/info/:pk/
    @exceptions
    def get(self, request, pk):
        info = Info.objects.get(pk=pk)
        serialized_info = InfoSerializer(info)
        return Response(serialized_info.data)
    
    # PUT SINGLE INFO
    # Endpoint: PUT /api/info/:pk
    @exceptions
    def put(self, request, pk):
        info = Info.objects.get(pk=pk)
        serialized_info = InfoSerializer(info, request.data, partial=True)
        serialized_info.is_valid(raise_exception=True)
        serialized_info.save()
        return Response(serialized_info.data)