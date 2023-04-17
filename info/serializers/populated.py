from .common import InfoSerializer
from players.models import Player
from players.serializers.populated import PopulatedPlayerSerializer
from rest_framework.response import Response
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
        for existing_player in existing_players:
            if existing_player.id in [player_data['id'] for player_data in players_data] and existing_players:
                instance.selected_players.remove(existing_player)
                instance.budget = round(instance.budget + existing_player.price, 1)
            else:
                for player_data in players_data:
                    player_id = player_data.get('id')
                    player = Player.objects.get(id=player_id)

                    if instance.budget - player.price < 0 or team_counts[player.team.name] == 3 or len(existing_players) == 11: 
                    # or position_counts['FW'] == 2 or position_counts['MF'] == 4 or position_counts['DF'] == 4 or position_counts['GK'] == 1:
                        instance.budget = round(instance.budget, 1)
                        continue
                    else:
                        instance.selected_players.add(player)
                        instance.budget = round(instance.budget - player.price, 1)

        # When the list is empty, add the player straight in
        if not existing_players:
            for player_data in players_data:
                player_id = player_data.get('id')
                player = Player.objects.get(id=player_id)
                instance.selected_players.add(player)
                instance.budget = round(instance.budget - player.price, 1)

        instance.save()
        return instance
