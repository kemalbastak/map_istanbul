from django.contrib.gis.db import models
from django.contrib.gis.geos import Point

from common.mixins import AuditMixin


class GisModelMixin(AuditMixin):
    location = models.PointField(geography=True, default=Point(28.9784, 41.0082))

    class Meta:
        abstract = True
