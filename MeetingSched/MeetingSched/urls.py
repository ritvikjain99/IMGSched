from django.urls import path, include
from django.contrib import admin
from Meetapp import views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('Meetapp.urls'))

]