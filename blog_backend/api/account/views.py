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

# Admin User Management
from django.contrib.auth.models import User

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_users_list(request):
    if not request.user or not request.user.is_staff:
        return Response({'detail': 'You do not have permission to perform this action.'}, status=status.HTTP_403_FORBIDDEN)
    
    users = User.objects.all().order_by('id')
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def admin_user_detail(request, pk):
    if not request.user or not request.user.is_staff:
        return Response({'detail': 'You do not have permission to perform this action.'}, status=status.HTTP_403_FORBIDDEN)
        
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
    if request.method == 'PUT':
        if user == request.user and 'is_staff' in request.data and not request.data['is_staff']:
            return Response({'error': 'You cannot remove your own staff status.'}, status=status.HTTP_400_BAD_REQUEST)
            
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    elif request.method == 'DELETE':
        if user == request.user:
            return Response({'error': 'You cannot delete yourself.'}, status=status.HTTP_400_BAD_REQUEST)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)