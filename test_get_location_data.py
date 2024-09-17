import pandas as pd
import ssl

from django.contrib.auth.models import Group
from django.contrib.gis.geos import Point
from datetime import datetime
from apps.map.models import Locations, County

ssl._create_default_https_context = ssl._create_unverified_context


url = "https://data.ibb.gov.tr/dataset/7456b10e-1128-48f7-82f5-5503d98bfb1b/resource/f4f56e58-5210-4f17-b852-effe356a890c/download/ispark_parking.csv"
df = pd.read_csv(url)
print(df.head(6))

Group.objects.get_or_create(name='Harita')


for _, row in df.iterrows():
    location = Point(float(row['LONGITUDE']), float(row['LATITUDE']), srid=4326)
    try:
        start, end = row['WORKING_TIME'].split('-')
        working_time = {
            'working_start_time':datetime.strptime(start, "%H:%M"),
            'working_end_time': datetime.strptime(end, "%H:%M"),
        }
    except ValueError as e:
        print(e)
        working_time = {}

    county, created = County.objects.get_or_create(name=row['COUNTY_NAME'])

    Locations.objects.create(
        park_name=row['PARK_NAME'],
        location_name=row['LOCATION_NAME'],
        park_type_id=row['PARK_TYPE_ID'],
        park_type_desc=row['PARK_TYPE_DESC'],
        capacity_of_park=row['CAPACITY_OF_PARK'],
        county_name=county,
        location=location,
        **working_time
    )