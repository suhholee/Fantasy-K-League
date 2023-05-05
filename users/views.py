from rest_framework.views import APIView
from rest_framework.response import Response
from .models import User
from .serializers.common import UserSerializer
from info.models import Info
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
import jwt
from datetime import datetime, timedelta
from django.conf import settings

from lib.exceptions import exceptions

from django.contrib.auth import get_user_model
User = get_user_model()

class RegisterView(APIView):

    # REGISTER ROUTE
    # Endpoint: POST /api/users/register/
    @exceptions
    def post(self, request):
        user_to_add = UserSerializer(data=request.data)
        user_to_add.is_valid(raise_exception=True)
        user = user_to_add.save()
        dt = datetime.now() + timedelta(days=28)
        token = jwt.encode({ 'sub':  user.id, 'exp': int(dt.strftime('%s')) }, settings.SECRET_KEY, algorithm='HS256')
        print('TOKEN ->', token)

        info = Info(user=user, budget=65)
        info.save()

        return Response({ 'data': user_to_add.data, 'token': token }, status.HTTP_201_CREATED)
    

class LoginView(APIView):

    # LOGIN ROUTE
    # Endpoint: POST /api/users/login/
    @exceptions
    def post(self, request):
        email = request.data['email']
        password = request.data['password']
        user_to_login = User.objects.get(email=email)
        if not user_to_login.check_password(password):
            print('PASSWORDS DONT MATCH')
            raise PermissionDenied('Unauthorized')
        dt = datetime.now() + timedelta(days=28)
        token = jwt.encode({ 'sub':  user_to_login.id, 'exp': int(dt.strftime('%s')) }, settings.SECRET_KEY, algorithm='HS256')
        print('TOKEN ->', token)
        return Response({ 'message': f"Welcome back, {user_to_login.username}", 'token': token })
    
