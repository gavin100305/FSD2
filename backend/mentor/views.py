from django.shortcuts import render
from django.contrib.auth import login, logout, authenticate
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.authtoken.models import Token

from .models import Mentor
from .serializers import MentorSerializer

# Create your views here.

class MentorViewSet(viewsets.ViewSet):
    """
    A ViewSet for Mentor authentication (Register, Login, Logout, Profile).
    """
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def register(self, request):
        """Register a new mentor"""
        serializer = MentorSerializer(data=request.data)
        if serializer.is_valid():
            # Create mentor but don't save yet
            mentor = Mentor(
                username=serializer.validated_data['username'],
                email=serializer.validated_data.get('email', ''),
                phone_number=serializer.validated_data.get('phone_number', ''),
                expertise=serializer.validated_data.get('expertise', '')
            )
            # Set password properly
            mentor.set_password(request.data['password'])
            mentor.save()
            
            return Response({
                'status': 'success',
                'message': 'Mentor registered successfully',
                'data': MentorSerializer(mentor).data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'status': 'error',
            'message': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def login(self, request):
        """Login a mentor"""
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({
                'status': 'error',
                'message': 'Both username and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)

        if user is not None and isinstance(user, Mentor):
            login(request, user)
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'status': 'success',
                'message': 'Login successful',
                'token': token.key,
                'data': MentorSerializer(user).data
            }, status=status.HTTP_200_OK)

        return Response({
            'status': 'error',
            'message': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        """Logout a mentor & delete authentication token"""
        request.user.auth_token.delete()
        logout(request)
        return Response({
            'status': 'success',
            'message': 'Logged out successfully'
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def profile(self, request):
        """Retrieve authenticated mentor's profile"""
        return Response({
            'status': 'success',
            'data': MentorSerializer(request.user).data
        }, status=status.HTTP_200_OK)
