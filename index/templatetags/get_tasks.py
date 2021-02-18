from django import template
register = template.Library()

@register.filter
def get_tasks(note):
    return note.todos.all()