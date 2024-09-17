import json

from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.utils.safestring import mark_safe

from common.wrappers.login import drf_login_required


def login(request):
    return render(request, "login.html")


@drf_login_required
def map(request):
    return render(request, "map.html")


def register(request):
    return render(request, "register.html")

def context(request):
    access_key = request.COOKIES.get('userData', {})
    return {"USER_ACCESS_KEY": mark_safe(access_key)}
