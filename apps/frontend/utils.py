import json

from rest_framework_simplejwt.authentication import JWTAuthentication


def get_user_from_cookie(request):
    access_key = request.COOKIES.get('userData', {})
    user = None
    if access_key:
        jwt_auth = JWTAuthentication()
        validated_token = jwt_auth.get_validated_token(json.loads(access_key).get('access'))
        user = jwt_auth.get_user(validated_token)
    return user


