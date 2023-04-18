from django.urls import path
from .views import InfoListView, InfoDetailView

urlpatterns = [
    path('', InfoListView.as_view()),
    path('<int:user>/', InfoDetailView.as_view())
]