from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

class MentorManager(BaseUserManager):
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

class Mentor(AbstractUser):
    mentor_id = models.CharField(max_length=20, unique=True, null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    expertise = models.CharField(max_length=200, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)

    objects = MentorManager()

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = "Mentor"
        verbose_name_plural = "Mentors"

    groups = models.ManyToManyField(
        "auth.Group",
        related_name="mentor_users",
        blank=True
    )

    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="mentor_users_permissions",
        blank=True
    )
