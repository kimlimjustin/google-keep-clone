from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.db import IntegrityError
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.forms.models import model_to_dict
from .models import User, Notes, Checkbox, Labels
from django.core import serializers
import json

# Create your views here.
def index(request):
    # User should be authenticated.
    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse('login'))
    return render(request, "index/index.html", {
        "notes": Notes.objects.filter(user = request.user, deleted = False).order_by('-pk')
    })

def login_view(request):
    # Check if the user is logged in
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse('index'))
    if request.method == "POST":
        username = request.POST["username"].lower()
        password = request.POST["password"]
        user = authenticate(request, username = username, password = password)
        # if user authentication success
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse('index'))
        else:
            return render(request, "index/login.html", {
                "message": "Invalid username and/or password"
            })
    return render(request, "index/login.html")

def register(request):
    # Check if the user is logged in
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse('index'))
    if request.method == "POST":
        username = request.POST['username'].lower()
        password = request.POST["password"]
        email = request.POST["email"]
        confirmation = request.POST["confirmation"]
        # Check if the password is the same as confirmation
        if password != confirmation:
            return render(request, "index/register.html", {
                "message": "Passwords must match."
            })
        # Checks if the username is already in use
        if User.objects.filter(email = email).count() == 1:
            return render(request, "index/register.html", {
                "message": "Email already taken."
            })
        try:
            user = User.objects.create_user(username = username, password = password, email = email)
            user.save()
            login(request, user)
            return HttpResponseRedirect(reverse('index'))
        except IntegrityError:
            return render(request, "index/register.html", {
                "message": "Username already taken"
            })
    return render(request, "index/register.html")

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def update_setting(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse("index"))
    if request.method == "POST":
        data = json.loads(request.body)
        UItheme = data["theme"]
        view = data["view"]
        user = User.objects.get(id = request.user.id)
        user.UItheme = UItheme
        user.view = view
        user.save()
        return JsonResponse({"message": "Success"})

def create_note(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse('index'))
    if request.method == "POST":
        data = json.loads(request.body)
        note = Notes(title = data["title"], note = data["note"], user = request.user, color = data["color"])
        note.save()
        for i in data["tasks"]:
            task = Checkbox(todo = i)
            task.save()
            note.todos.add(task)
            note.save()
        return JsonResponse({"message": "Success", "tasks": serializers.serialize('json', note.todos.all()), "pk": note.pk})

def delete_note(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse("index"))
    if request.method == "POST":
        data = json.loads(request.body)
        note = Notes.objects.get(pk = data["pk"])
        note.deleted = True
        note.save()
        return JsonResponse({"message": "Success"})