from django.urls import path, include

from apps.map.api.routers import map_routers

urlpatterns = [
    path('', include(map_routers.urls)),
]