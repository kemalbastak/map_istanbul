from django.contrib.auth.models import AbstractUser
from common.mixins import AuditMixin
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin


class CustomUser(AbstractUser, AuditMixin):
    # Add custom fields here

    def __str__(self):
        return self.username


    class Meta(AbstractUser.Meta):
        swappable = "AUTH_USER_MODEL"

