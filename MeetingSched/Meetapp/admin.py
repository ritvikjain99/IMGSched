from django.contrib import admin
from .models import Meeting, Comment

models = [Meeting, Comment]

admin.site.register(models)