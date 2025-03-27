from django.contrib.auth import login, logout, authenticate
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.authtoken.models import Token
from social_django.utils import load_strategy, load_backend
from social_core.exceptions import MissingBackend

from .models import Student
from .serializers import StudentSerializer


class StudentViewSet(viewsets.ViewSet):
    """
    A ViewSet for Student authentication (Register, Login, Logout, Profile).
    """
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def register(self, request):
        """Register a new student"""
        serializer = StudentSerializer(data=request.data)
        if serializer.is_valid():
            student = serializer.save()
            student.set_password(request.data["password"])  # Hash password
            student.save()
            return Response({
                'status': 'success',
                'message': 'Student registered successfully',
                'data': StudentSerializer(student).data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'status': 'error',
            'message': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def login(self, request):
        """Login a student & return authentication token"""
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            token, _ = Token.objects.get_or_create(user=user)  # Generate auth token
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

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        """Logout a student & delete authentication token"""
        request.user.auth_token.delete()  # Remove token
        logout(request)
        return Response({
            'status': 'success',
            'message': 'Logged out successfully'
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def profile(self, request):
        """Retrieve authenticated student's profile"""
        return Response({
            'status': 'success',
            'data': StudentSerializer(request.user).data
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def github_login(self, request):
        """Initiate GitHub OAuth login"""
        return Response({
            'status': 'success',
            'github_auth_url': '/login/github/'
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def github_callback(self, request):
        """Handle GitHub OAuth callback"""
        code = request.GET.get('code')
        if not code:
            return Response({
                'status': 'error',
                'message': 'No code provided'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            strategy = load_strategy(request)
            backend = load_backend(strategy=strategy, name='github', redirect_uri=None)

            user = backend.complete(request=request)

            if user and user.is_active:
                login(request, user)
                token, _ = Token.objects.get_or_create(user=user)  # Generate auth token
                return Response({
                    'status': 'success',
                    'message': 'GitHub login successful',
                    'token': token.key,
                    'data': StudentSerializer(user).data
                }, status=status.HTTP_200_OK)

        except MissingBackend:
            return Response({
                'status': 'error',
                'message': 'Authentication failed'
            }, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Create your views here.
