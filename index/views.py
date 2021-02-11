from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.db import IntegrityError
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from .models import User, Notes, Checkbox, Labels
import json

# Create your views here.
def index(request):
    # User should be authenticated.
    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse('login'))
    return render(request, "index/index.html")

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
        note = Notes(title = data["title"], note = data["note"], user = request.user)
        note.save()
        return JsonResponse({"message": "Success"})