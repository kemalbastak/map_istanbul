from django.contrib.gis.db import models

from common.mixins import AuditMixin
from common.mixins.gis_model import GisModelMixin
from django.utils.translation import gettext_lazy as _


class County(AuditMixin):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class Locations(GisModelMixin):
    park_name = models.CharField(max_length=255)
    location_name = models.CharField(max_length=255, verbose_name=_('Lokasyon Adı'))
    park_type_id = models.CharField(max_length=100, verbose_name=_('Park ID'))
    park_type_desc = models.CharField(max_length=100, verbose_name=_('Park Açıklama'))
    capacity_of_park = models.IntegerField(verbose_name=_('Kapasite'))
    working_start_time = models.TimeField(blank=True, null=True, verbose_name=_('Açılış Saati'))
    working_end_time = models.TimeField(blank=True, null=True, verbose_name=_('Kapanış Saati'))
    county_name = models.ForeignKey(County, on_delete=models.CASCADE, verbose_name=_('İlçe'))

    def __str__(self):
        return self.park_name
