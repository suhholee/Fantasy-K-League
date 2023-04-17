from django.db import models
from django.conf import settings

# Create your models here.
class Info(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='info'
    )
    budget = models.FloatField(default=65)
    gw_points = models.IntegerField(default=0)
    total_points = models.IntegerField(default=0)