from rest_framework.permissions import BasePermission
from rest_framework_simplejwt.authentication import JWTAuthentication

from common.enums.group import GroupEnum


class HasAccessMap(BasePermission):
    """
    Allows access only to authenticated users.
    """

    @staticmethod
    def get_user_groups(request):
        user, token_data = JWTAuthentication().authenticate(request)
        return user.groups.all()

    def validate_user_groups(self, request) -> bool:
        groups = self.get_user_groups(request)
        required_group = GroupEnum.map.value
        if not groups:
            return False
        return groups.filter(name=required_group).exists()

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and self.validate_user_groups(request))
