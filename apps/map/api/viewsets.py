from rest_framework import viewsets
from ..models import Locations
from .serializers import ParkSerializer

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Locations.objects.all().select_related('county_name')
    serializer_class = ParkSerializer
