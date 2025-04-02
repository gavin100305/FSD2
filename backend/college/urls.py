from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CollegeViewSet

router = DefaultRouter()
router.register(r'colleges', CollegeViewSet, basename='college')

urlpatterns = [
    path('', include(router.urls)),
]
