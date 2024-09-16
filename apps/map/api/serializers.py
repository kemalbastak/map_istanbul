from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from apps.map.models import Locations


class ParkSerializer(GeoFeatureModelSerializer):
    county_name = serializers.CharField(source='county_name.name')
    working_hours = serializers.SerializerMethodField()

    class Meta:
        model = Locations
        fields = (
            'id',
            'park_name',
            'location_name',
            'park_type_id',
            'park_type_desc',
            'capacity_of_park',
            'working_hours',
            'county_name',
            'location',
        )
        geo_field = 'location'  # Specify which field is the geometry
        id_field = 'id'

    def get_working_hours(self, obj):
        return f"{obj.working_start_time.strftime('%H:%M')} - {obj.working_end_time.strftime('%H:%M')}" if obj.working_start_time and obj.working_end_time else "24 Saat"
