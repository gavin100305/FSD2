from rest_framework import serializers
from .models import College

class CollegeSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = College
        fields = [
            "id",
            "username",
            "password",
        ]
        extra_kwargs = {
            'password': {'write_only': True},
        }
