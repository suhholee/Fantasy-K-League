from django.urls import path
from .views import PlayerListView

# /api/oceans/
urlpatterns = [
    path('', PlayerListView.as_view()), # path for this is /api/oceans/
]