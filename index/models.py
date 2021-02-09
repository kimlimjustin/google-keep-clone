from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser, models.Model):
    email = models.EmailField(unique=True)
    UItheme = models.CharField(default = "dark", max_length=10)
    view = models.CharField(default="grid", max_length=10)