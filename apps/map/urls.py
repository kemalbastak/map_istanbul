from django.urls import path, include

from apps.map.api.routers import map_routers

urlpatterns = [
    path('map/', include(map_routers.urls)),
]