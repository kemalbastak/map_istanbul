from drf_spectacular.utils import extend_schema
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from common.permissions.group import HasAccessMap
from ..models import Locations
from .serializers import ParkSerializer

@extend_schema(tags=['Map'])
class LocationViewSet(viewsets.ModelViewSet):
    queryset = Locations.objects.all().select_related('county_name')
    serializer_class = ParkSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [HasAccessMap]
