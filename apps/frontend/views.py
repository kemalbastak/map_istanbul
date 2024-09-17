from django.contrib.auth.models import Group
from django.shortcuts import render, redirect
from django.utils.safestring import mark_safe

from apps.frontend.utils import get_user_from_cookie
from common.enums.group import GroupEnum
from common.wrappers.login import drf_login_required


def login(request):
    return render(request, "login.html")


@drf_login_required
def map(request):
    return render(request, "map.html")


def register(request):
    return render(request, "register.html")

@drf_login_required
def permission_control(request):
    user = get_user_from_cookie(request)
    if user.groups.filter(name=GroupEnum.map.value):
        return redirect("frontend/:map")


    if request.method == "POST":
        user.groups.add(Group.objects.get(name=GroupEnum.map.value))

    return render(request, "permission-control.html")


def index(request):
    return redirect("frontend/:login")


def context(request):
    access_key = request.COOKIES.get('userData', {})
    return {"USER_ACCESS_KEY": mark_safe(access_key)}
