from django.db import models
from django.contrib.auth.models import AbstractUser

class Mentor(AbstractUser):
    mentor_id = models.CharField(max_length=20, unique=True, null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    expertise = models.CharField(max_length=200, null=True, blank=True)
    email = models.EmailField(unique=True, null=True, blank=True)

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
