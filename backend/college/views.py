from django.shortcuts import render
from django.contrib.auth import login, logout, authenticate
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.authtoken.models import Token
from django.db import transaction

from .models import College
from .serializers import CollegeSerializer

# Create your views here.

class CollegeViewSet(viewsets.ViewSet):
    """
    A ViewSet for College authentication (Register, Login, Logout, Profile).
    """
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    @transaction.atomic
    def register(self, request):
        """Register a new college"""
        try:
            username = request.data.get('username')
            password = request.data.get('password')

            if not username or not password:
                return Response({
                    'status': 'error',
                    'message': 'Username and password are required'
                }, status=status.HTTP_400_BAD_REQUEST)

            if College.objects.filter(username=username).exists():
                return Response({
                    'status': 'error',
                    'message': 'Username already exists'
                }, status=status.HTTP_400_BAD_REQUEST)

            college = College.objects.create_user(
                username=username,
                password=password
            )

            return Response({
                'status': 'success',
                'message': 'College registered successfully',
                'data': CollegeSerializer(college).data
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def login(self, request):
        """Login a college"""
        try:
            username = request.data.get('username')
            password = request.data.get('password')

            if not username or not password:
                return Response({
                    'status': 'error',
                    'message': 'Both username and password are required'
                }, status=status.HTTP_400_BAD_REQUEST)

            user = authenticate(request, username=username, password=password)

            if user is not None and isinstance(user, College):
                login(request, user)
                token, _ = Token.objects.get_or_create(user=user)
                return Response({
                    'status': 'success',
                    'message': 'Login successful',
                    'token': token.key,
                    'data': CollegeSerializer(user).data
                }, status=status.HTTP_200_OK)

            return Response({
                'status': 'error',
                'message': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)

        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        """Logout a college"""
        try:
            request.user.auth_token.delete()
            logout(request)
            return Response({
                'status': 'success',
                'message': 'Logged out successfully'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def profile(self, request):
        """Get college profile"""
        try:
            return Response({
                'status': 'success',
                'data': CollegeSerializer(request.user).data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
