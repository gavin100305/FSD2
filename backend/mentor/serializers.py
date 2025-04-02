from rest_framework import serializers
from .models import Mentor

class MentorSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = Mentor
        fields = [
            "id",
            "username",
            "password",
            "email",
            "first_name",
            "last_name",
            "mentor_id",
            "phone_number",
            "expertise",
        ]
        extra_kwargs = {
            'password': {'write_only': True},
        }
