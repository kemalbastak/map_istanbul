import django_filters
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance

from .models import Locations
from django.db.models import Q
from django.utils import timezone


class LocationFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method='filter_by_all_fields')
    is_open_now = django_filters.BooleanFilter(method='filter_by_open_now', label="Open Now")
    closest = django_filters.CharFilter(method='filter_by_closest')
    park_name = django_filters.CharFilter(field_name='park_name', lookup_expr='icontains')
    location_name = django_filters.CharFilter(field_name='location_name', lookup_expr='icontains')
    county_name = django_filters.CharFilter(field_name='county_name__name', lookup_expr='icontains')

    class Meta:
        model = Locations
        fields = ['park_name', 'location_name', 'county_name']

    def filter_by_all_fields(self, queryset, name, value):
        return queryset.filter(
            Q(park_name__icontains=value) |
            Q(location_name__icontains=value) |
            Q(county_name__name__icontains=value) |
            Q(park_type_desc__icontains=value) |
            Q(park_type_id__icontains=value) |
            Q(capacity_of_park__icontains=value)  # If capacity is a number, you can use exact match.
        )

    def filter_by_open_now(self, queryset, name, value):
        if value:
            current_time = timezone.localtime().time()
            return queryset.filter(
                Q(working_start_time__lte=current_time) &
                Q(working_end_time__gte=current_time)
            ) | queryset.filter(working_start_time__isnull=True, working_end_time__isnull=True)
        return queryset

    def filter_by_closest(self, queryset, name, value):
        try:
            lon, lat = map(float, value.split(','))
            user_location = Point(lon, lat, srid=4326)
            return queryset.annotate(distance=Distance('location', user_location)).order_by('distance')[:5]
        except (ValueError, TypeError):
            return queryset