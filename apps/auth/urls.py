from django.urls import path, include
from apps.auth.api.viewsets import AuthTokenObtainPairView, AuthTokenRefreshView, AuthTokenBlacklistView

from apps.auth.api.routers import auth_routers


urlpatterns = [
    path('auth/login/', AuthTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', AuthTokenRefreshView.as_view(), name='token_refresh'),
    path('auth/blacklist/', AuthTokenBlacklistView.as_view(), name='token_blacklist'),

    path('auth/', include(auth_routers.urls)),

]
