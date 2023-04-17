from .common import InfoSerializer
from players.serializers.common import Player, PlayerSerializer

class PopulatedInfoSerializer(InfoSerializer):
    selected_players = PlayerSerializer(many=True)

    def update(self, instance, validated_data):
        players_data = validated_data.pop('selected_players', [])
        existing_players = instance.selected_players.all()
        updated_budget = instance.budget

        # When there is players in the selected_players list
        for existing_player in existing_players:
            if existing_player.id in [player_data['id'] for player_data in players_data] and existing_players:
                instance.selected_players.remove(existing_player)
                instance.budget = updated_budget + existing_player.price
            else:
                for player_data in players_data:
                    player_id = player_data.get('id')
                    player = Player.objects.get(id=player_id)
                    instance.selected_players.add(player)
                    instance.budget = updated_budget - player.price

        # When the list is empty, add the player straight in
        if not existing_players:
            for player_data in players_data:
                player_id = player_data.get('id')
                player = Player.objects.get(id=player_id)
                instance.selected_players.add(player)
                instance.budget = updated_budget - player.price

        instance.save()
        return instance
