from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "student_id",
            "phone_number",
            "github_username",
            "github_url",
            # "groups",  # Include groups if needed
            # "user_permissions",  # Include permissions if needed
        ]
        extra_kwargs = {
            "password": {"write_only": True},  # Hide password field
        }
