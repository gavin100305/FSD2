from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Mentor

# Register your models here.
admin.site.register(Mentor, UserAdmin)
