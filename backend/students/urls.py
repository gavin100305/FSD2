from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import StudentViewSet

router = DefaultRouter()
router.register(r'students', StudentViewSet, basename='student')



urlpatterns = router.urls