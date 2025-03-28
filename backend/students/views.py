from django.contrib.auth import login, logout, authenticate
from django.contrib.auth import get_backends
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.authtoken.models import Token
from django.conf import settings
import requests

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
        """Return the GitHub authorization URL"""
        client_id = settings.SOCIAL_AUTH_GITHUB_KEY
        redirect_uri = "http://127.0.0.1:8000/api/students/github_callback/"
        github_auth_url = f"https://github.com/login/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&scope=user:email"

        # ✅ Instead of returning JSON, directly redirect to GitHub
        return Response({"github_auth_url": github_auth_url}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path="github_callback")
    def github_callback(self, request):
        """Handle GitHub OAuth callback"""
        code = request.GET.get('code')
        if not code:
            return Response({'status': 'error', 'message': 'No code provided'}, status=status.HTTP_400_BAD_REQUEST)
    
        client_id = settings.SOCIAL_AUTH_GITHUB_KEY
        client_secret = settings.SOCIAL_AUTH_GITHUB_SECRET
        token_url = "https://github.com/login/oauth/access_token"
    
        # Exchange code for access token
        data = {
            'client_id': client_id,
            'client_secret': client_secret,
            'code': code
        }
        headers = {'Accept': 'application/json'}
        response = requests.post(token_url, data=data, headers=headers)
    
        if response.status_code != 200:
            return Response({'status': 'error', 'message': 'Failed to get access token'}, status=status.HTTP_400_BAD_REQUEST)
    
        token_data = response.json()
        access_token = token_data.get('access_token')
    
        if not access_token:
            return Response({'status': 'error', 'message': 'Access token not received'}, status=status.HTTP_400_BAD_REQUEST)
    
        # Fetch GitHub user details
        user_url = "https://api.github.com/user"
        user_response = requests.get(user_url, headers={'Authorization': f'token {access_token}'})
    
        if user_response.status_code != 200:
            return Response({'status': 'error', 'message': 'Failed to fetch GitHub user data'}, status=status.HTTP_400_BAD_REQUEST)
    
        github_user = user_response.json()
        github_username = github_user.get('login')
    
        # Check if user exists
        student, created = Student.objects.get_or_create(github_username=github_username)
        if created:
            student.email = github_user.get('email', '')
            student.username = github_username
            student.save()
    
        # ✅ Explicitly specify the authentication backend
        backend = get_backends()[0]  # Get the first available backend
        student.backend = f"{backend.__module__}.{backend.__class__.__name__}"  # Set backend
    
        login(request, student, backend=student.backend)  # ✅ Fix the login error
    
        token, _ = Token.objects.get_or_create(user=student)
    
        return Response({
            'status': 'success',
            'token': token.key,
            'data': StudentSerializer(student).data
        }, status=status.HTTP_200_OK)
    