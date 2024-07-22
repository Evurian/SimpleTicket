from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import permission_classes
from rest_framework.authtoken.models import Token
from django.core.mail import send_mail
from django.conf import settings
import requests
from django.http import JsonResponse
from django.views import View

from api.account.serializers import signUpSerializer, signInSerializer, UserSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def signUp(request):
    if request.method == 'POST':
        serializer = signUpSerializer(data = request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Enviar correo de bienvenida
            subject = 'Bienvenido a nuestra plataforma'
            message = f'Hola {user.username},\n\nGracias por registrarte en nuestra plataforma. ¡Esperamos que disfrutes de nuestros servicios!'
            from_email = settings.EMAIL_HOST_USER
            recipient_list = [user.email]
            
            send_mail(subject, message, from_email, recipient_list)

            return Response(serializer.data, status = status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
@permission_classes([AllowAny])
def signIn(request):
    serializer = signInSerializer(data = request.data)
    if serializer.is_valid():
        user = serializer.validated_data
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key}, status = status.HTTP_200_OK)
    return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

# Profile
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data, status = status.HTTP_200_OK)

# Profile Edit
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def profileUpdate(request):
    user = request.user
    serializer = UserSerializer(user, data = request.data, partial = True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status = status.HTTP_200_OK)
    return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)