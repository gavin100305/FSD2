from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

class CollegeManager(BaseUserManager):
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

class College(AbstractUser):
    objects = CollegeManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = "College"
        verbose_name_plural = "Colleges"

    groups = models.ManyToManyField(
        "auth.Group",
        related_name="college_users",
        blank=True
    )

    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="college_users_permissions",
        blank=True
    )
