from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name = "index"),
    path('login', views.login_view, name="login"),
    path('register', views.register, name="register"),
    path('logout', views.logout_view, name="logout"),
    path('update_setting', views.update_setting, name="update_setting"),
    path('create_note', views.create_note, name="create_note")
]