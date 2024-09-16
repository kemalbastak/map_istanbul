from django.contrib import admin
from .models import Locations
from django.contrib.gis import admin as geo_admin


@admin.register(Locations)
class LocationsAdmin(geo_admin.GISModelAdmin):
    search_fields = ('park_name', 'location_name', 'park_type_id', 'park_type_desc')
    list_display = ('park_name', 'location')
    list_filter = ('county_name',)

