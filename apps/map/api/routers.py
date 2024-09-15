from rest_framework import routers

from .viewsets import LocationViewSet

map_routers = routers.DefaultRouter()
map_routers.register(r'park-locations', LocationViewSet,
                     basename='park-locations')
