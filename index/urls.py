from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name = "index"),
    path('login', views.login_view, name="login"),
    path('register', views.register, name="register"),
    path('logout', views.logout_view, name="logout"),
    path('update_setting', views.update_setting, name="update_setting"),
    path('create_note', views.create_note, name="create_note"),
    path('delete_note', views.delete_note, name="delete_note"),
    path('restore_note', views.restore, name="restore"),
    path('trash', views.trash, name="trash"),
    path('delete_permanent', views.permanently_delete_note, name="permanently_delete_note"),
    path('check_task', views.check_task, name="check_task"),
    path('uncheck_task', views.uncheck_task, name="uncheck_task"),
    path("update_title", views.update_title, name="update_title"),
    path('update_note_text', views.update_note_text, name="update_note_text"),
    path('update_task', views.update_task, name="update_task"),
    path('delete_task', views.delete_task, name="delete_task"),
    path('create_task', views.create_task, name="create_task"),
    path('show_checkbox', views.show_checkbox, name="show_checkbox"),
    path('hide_checkbox', views.hide_checkbox, name="hide_checkbox")
]