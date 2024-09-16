from rest_framework import routers

from .viewsets import UserViewSet

auth_routers = routers.DefaultRouter()
auth_routers.register(r'user/me', UserViewSet,
                      basename='user_me')
