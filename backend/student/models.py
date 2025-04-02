from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

class StudentManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError('The Username field must be set')
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, password, **extra_fields)

class Student(AbstractUser):
    student_id = models.CharField(max_length=20, unique=True, null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    github_username = models.CharField(max_length=100, null=True, blank=True)
    github_url = models.URLField(max_length=200, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)

    objects = StudentManager()

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = "Student"
        verbose_name_plural = "Students" 