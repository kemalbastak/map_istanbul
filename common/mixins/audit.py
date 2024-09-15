from django.contrib.gis.db import models
from django.utils import timezone
from django_currentuser.middleware import get_current_authenticated_user
import uuid


class UUIDModelMixin(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True


class TimeStampMixin(UUIDModelMixin):
    """
    A mixin to automatically generate created and updated Date attributes for Models
    """

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class AuditMixin(TimeStampMixin):
    """
    AuditMixin will add automatic timestamp of created and modified by who
    """

    created_by = models.CharField(max_length=255, blank=True, editable=False, null=True)
    updated_by = models.CharField(max_length=255, blank=True, editable=False, null=True)

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):

        user = get_current_authenticated_user()

        self.updated_at = timezone.now()

        if user:
            self.updated_by = user and user.username or None

        if not self.pk:

            self.created_at = timezone.now()

            self.updated_at = self.created_at

            if user:
                self.created_by = user and user.username or None

        super(AuditMixin, self).save(*args, **kwargs)


class IsActiveMixin(AuditMixin):
    is_active = models.BooleanField(default=True)

    class Meta:
        abstract = True
