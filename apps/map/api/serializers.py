from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from apps.map.models import Locations, County


class LocationsSerializer(GeoFeatureModelSerializer):
    uid = serializers.CharField(source='id', read_only=True)  # propertyde id görünmediği için bu şekilde ekledik
    county_name = serializers.CharField(source="county_name.name")

    class Meta:
        model = Locations
        fields = (
            'id',
            'uid',
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
        extra_kwargs = {'working_start_time': {'required': False}, 'working_end_time': {'required': False}}


    def create(self, validated_data):
        # Handle nested county_name and extract the actual county object
        county_data = validated_data.pop('county_name', None)
        if county_data:
            county_name = county_data['name']
            county_obj, created = County.objects.get_or_create(name__iexact=county_name)  # Create or get existing county

        # Create the Location instance with the validated data
        location = Locations.objects.create(
            park_name=validated_data.get('park_name'),
            location_name=validated_data.get('location_name'),
            park_type_id=validated_data.get('park_type_id'),
            park_type_desc=validated_data.get('park_type_desc'),
            capacity_of_park=validated_data.get('capacity_of_park'),
            working_start_time=validated_data.get('working_start_time'),
            working_end_time=validated_data.get('working_end_time'),
            county_name=county_obj,  # Assign the county object
            location=validated_data.get('location')  # This is the GeoField
        )

        return location

    def update(self, instance: Locations, validated_data):
        county_data = validated_data.pop('county_name', None)
        if county_data:
            county_name = county_data['name']
            county_obj, created = County.objects.get_or_create(name__iexact=county_name)
            instance.county_name = county_obj

        instance.park_name = validated_data.get('park_name', instance.park_name)
        instance.location_name = validated_data.get('location_name', instance.location_name)
        instance.park_type_id = validated_data.get('park_type_id', instance.park_type_id)
        instance.park_type_desc = validated_data.get('park_type_desc', instance.park_type_desc)
        instance.county_name = validated_data.get('county_name', instance.county_name)
        instance.capacity_of_park = validated_data.get('capacity_of_park', instance.capacity_of_park)
        instance.working_start_time = validated_data.get('working_start_time', instance.working_start_time)
        instance.working_end_time = validated_data.get('working_end_time', instance.working_end_time)
        instance.location = validated_data.get('location', instance.location)  # GeoField update

        instance.save()
        return instance
