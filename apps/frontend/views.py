from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from common.wrappers.login import drf_login_required


def login(request):
    return render(request, "login.html")


@drf_login_required
def map(request):
    return render(request, "map.html")


def register(request):
    return render(request, "register.html")

def live(request):
    ...
