from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login, name='login'),
    path('map/', views.map, name='map'),
]