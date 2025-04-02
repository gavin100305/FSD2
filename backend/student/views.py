from django.contrib.auth import login, logout, authenticate
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.authtoken.models import Token
from django.db import transaction

from .models import Student
from .serializers import StudentSerializer

class StudentViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    @transaction.atomic
    def register(self, request):
        """Register a new student"""
        try:
            username = request.data.get('username')
            password = request.data.get('password')

            if not username or not password:
                return Response({
                    'status': 'error',
                    'message': 'Username and password are required'
                }, status=status.HTTP_400_BAD_REQUEST)

            if Student.objects.filter(username=username).exists():
                return Response({
                    'status': 'error',
                    'message': 'Username already exists'
                }, status=status.HTTP_400_BAD_REQUEST)

            student = Student.objects.create_user(
                username=username,
                password=password
            )

            return Response({
                'status': 'success',
                'message': 'Student registered successfully',
                'data': StudentSerializer(student).data
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def login(self, request):
        """Login a student"""
        try:
            username = request.data.get('username')
            password = request.data.get('password')

            if not username or not password:
                return Response({
                    'status': 'error',
                    'message': 'Both username and password are required'
                }, status=status.HTTP_400_BAD_REQUEST)

            user = authenticate(request, username=username, password=password)

            if user is not None and isinstance(user, Student):
                login(request, user)
                token, _ = Token.objects.get_or_create(user=user)
                return Response({
                    'status': 'success',
                    'message': 'Login successful',
                    'token': token.key,
                    'data': StudentSerializer(user).data
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