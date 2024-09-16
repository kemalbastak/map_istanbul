from django.shortcuts import render


def login(request):
    return render(request, "login.html")


def map(request):
    return render(request, "map.html")
