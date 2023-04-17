from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from ..models import Player

class PlayerSerializer(ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = Player
        fields = '__all__'