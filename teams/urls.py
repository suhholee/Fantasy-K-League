from django.urls import path
from .views import TeamListView

# /api/oceans/
urlpatterns = [
    path('', TeamListView.as_view()), # path for this is /api/oceans/
]