import json
from functools import wraps
from django.http import HttpResponseForbidden
from django.conf import settings
from django.shortcuts import redirect
from rest_framework.authentication import get_authorization_header
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication, api_settings

from common.enums.group import GroupEnum


def drf_login_required(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        user_data: str | None = request.COOKIES.get('userData')

        if not user_data:
            return redirect("frontend/:login")

        user_access_token = json.loads(user_data).get('access') if user_data else None

        request.META[api_settings.AUTH_HEADER_NAME] = "Bearer " + user_access_token
        user, token_data = JWTAuthentication().authenticate(request)
        # Perform DRF authentication
        if user is None:
            return redirect("frontend/:login")
        print(view_func.__name__)
        if not user.groups.filter(name=GroupEnum.map.value) and view_func.__name__ != "permission_control":
            return redirect("frontend/:permission_control")

        return view_func(request, *args, **kwargs)

    return _wrapped_view
