from django.contrib.gis.db import models

from common.mixins import AuditMixin


class GisModelMixin(AuditMixin):
    location = models.PointField(geography=True)

    class Meta:
        abstract = True
