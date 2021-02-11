from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser, models.Model):
    email = models.EmailField(unique=True)
    UItheme = models.CharField(default = "dark", max_length=10)
    view = models.CharField(default="grid", max_length=10)

class Checkbox(models.Model):
    done = models.BooleanField(default = False)
    todo = models.CharField(max_length= 1000)

class Notes(models.Model):
    title = models.CharField(max_length = 500, blank = True)
    note = models.CharField(max_length = 10000, blank = True)
    user = models.ForeignKey(User, on_delete = models.CASCADE, related_name = "user")
    archived = models.BooleanField(default = False)
    deleted = models.BooleanField(default = False)
    color = models.CharField(max_length= 10, default="#202124")
    todos = models.ManyToManyField(Checkbox, related_name = "todos")

class Labels(models.Model):
    label = models.CharField(max_length = 100)
    labeled = models.ManyToManyField(Notes, related_name  = "labeled")