from django.contrib.auth.models import AbstractUser
from django.db import models


class Avatar(models.Model):
    photo = models.ImageField(upload_to="avatars")


class User(AbstractUser):
    avatar = models.ForeignKey(
        "Avatar", null=True, blank=True, on_delete=models.PROTECT
    )
