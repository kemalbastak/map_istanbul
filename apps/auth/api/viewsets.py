from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, permissions

from rest_framework.exceptions import PermissionDenied
from rest_framework.request import Request

from .serializers import UserSerializer
from rest_framework_simplejwt import views as jwt_views

User = get_user_model()


@extend_schema(tags=['User'])
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return super().get_permissions()

    def update(self, request, *args, **kwargs):
        user = self.get_object()

        if user != request.user:
            raise PermissionDenied("You do not have permission to edit this user.")

        return super().update(request, *args, **kwargs)

    @csrf_exempt
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        user = self.get_object()

        if user != request.user:
            raise PermissionDenied("You do not have permission to edit this user.")

        return super().partial_update(request, *args, **kwargs)


    def destroy(self, request, *args, **kwargs):
        raise PermissionDenied("You cannot delete a user.")


@extend_schema(tags=['Auth'])
class AuthTokenObtainPairView(jwt_views.TokenObtainPairView):
    ...


@extend_schema(tags=['Auth'])
class AuthTokenRefreshView(jwt_views.TokenRefreshView):
    @csrf_exempt
    def post(self, request: Request, *args, **kwargs):
        return super().post(request, *args, **kwargs)



@extend_schema(tags=['Auth'])
class AuthTokenBlacklistView(jwt_views.TokenBlacklistView):
    ...
