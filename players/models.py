from django.db import models

# Create your models here.
class Player(models.Model):
    name = models.CharField(max_length=100)
    position = models.CharField(max_length=2)
    team = models.ForeignKey(
        'teams.Team',
        on_delete=models.CASCADE,
        related_name='players'
    )
    price = models.FloatField()
    gw_points = models.IntegerField()
    total_points = models.IntegerField()
    selected_users = models.ManyToManyField('info.Info', related_name='selected_players')

    def __str__(self):
        return f'{self.name} - {self.price}'