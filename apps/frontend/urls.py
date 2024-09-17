from django.urls import path
from . import views


app_name = "frontend/"

urlpatterns = [
    path('login/', views.login, name='login'),
    path('map/', views.map, name='map'),
    path('register/', views.register, name='register'),
    path('permission-control/', views.permission_control, name='permission_control'),
    path('', views.index, name='index'),
]