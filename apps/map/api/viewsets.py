from django_filters.rest_framework import DjangoFilterBackend, OrderingFilter
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets
from rest_framework.filters import SearchFilter

from rest_framework_simplejwt.authentication import JWTAuthentication

from common.permissions.group import HasAccessMap
from ..filters import LocationFilter
from ..models import Locations
from .serializers import LocationsSerializer


@extend_schema(tags=['Map'])
class LocationViewSet(viewsets.ModelViewSet):
    queryset = Locations.objects.all().select_related('county_name')
    serializer_class = LocationsSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [HasAccessMap]
    filter_backends = [DjangoFilterBackend]
    filterset_class = LocationFilter
