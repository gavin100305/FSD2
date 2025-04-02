from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import College

# Register your models here.
admin.site.register(College, UserAdmin)
