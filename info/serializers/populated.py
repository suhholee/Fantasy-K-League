from .common import InfoSerializer
from players.models import Player
from players.serializers.populated import PopulatedPlayerSerializer
from collections import Counter

class PopulatedInfoSerializer(InfoSerializer):
    selected_players = PopulatedPlayerSerializer(many=True)

    def update(self, instance, validated_data):
        players_data = validated_data.pop('selected_players', [])
        existing_players = instance.selected_players.all()

        # Counts the number of teams so that it does not go over 3 players from the same team
        team_counts = Counter(existing_player.team.name for existing_player in existing_players)
        # position_counts = Counter(existing_player.position for existing_player in existing_players)

        # When there is players in the selected_players list
        if existing_players:
            for player_data in players_data:
                player_id = player_data.get('id')
                player = Player.objects.get(id=player_id)
                if instance.budget - player.price >= 0:
                    if player in existing_players:
                        instance.selected_players.remove(player)
                        instance.budget = round(instance.budget + player.price, 1)
                    else:
                        instance.selected_players.add(player)
                        instance.budget = round(instance.budget - player.price, 1)
                elif instance.budget - player.price < 0:
                    if player in existing_players:
                        instance.selected_players.remove(player)
                        instance.budget = round(instance.budget + player.price, 1)
                    else:
                        continue
                elif team_counts[player.team.name] == 3 or len(existing_players) == 11:
                    continue

        # When the list is empty, add the player straight in
        if not existing_players:
            for player_data in players_data:
                player_id = player_data.get('id')
                player = Player.objects.get(id=player_id)
                instance.selected_players.add(player)
                instance.budget = round(instance.budget - player.price, 1)

        instance.save()
        return instance

