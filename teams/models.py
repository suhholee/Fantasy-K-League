from django.db import models
from django.core.validators import URLValidator

# Create your models here.

class Team(models.Model):
    name = models.CharField(max_length=100)
    abb = models.CharField(max_length=4)
    shirt_image = models.URLField(validators=[URLValidator()])
    next_match = models.CharField(max_length=8)

    def __str__(self):
        return f'{self.name} (vs {self.next_match})'
