from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MentorViewSet

router = DefaultRouter()
router.register(r'mentors', MentorViewSet, basename='mentor')

urlpatterns = [
    path("api/", include(router.urls)),
]
