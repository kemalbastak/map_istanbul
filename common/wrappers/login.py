from functools import wraps
from django.http import HttpResponseForbidden
from django.shortcuts import redirect
from rest_framework.authentication import get_authorization_header
from rest_framework.authentication import SessionAuthentication


def drf_login_required(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        auth = get_authorization_header(request).decode('utf-8')
        if not auth:
            return redirect("frontend/:login")

        # Perform DRF authentication
        auth_backend = SessionAuthentication()
        user_auth_tuple = auth_backend.authenticate(request)
        if user_auth_tuple is None:
            return redirect("frontend/:login")

        return view_func(request, *args, **kwargs)

    return _wrapped_view
