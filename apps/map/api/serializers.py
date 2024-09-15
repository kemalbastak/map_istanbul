from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from apps.map.models import Locations


class ParkSerializer(GeoFeatureModelSerializer):
    county_name = serializers.CharField(source='county_name.name')

    class Meta:
        model = Locations
        fields = (
            'id',
            'park_name',
            'location_name',
            'park_type_id',
            'park_type_desc',
            'capacity_of_park',
            'working_start_time',
            'working_end_time',
            'county_name',
            'location',
        )
        geo_field = 'location'  # Specify which field is the geometry
        id_field = 'id'
