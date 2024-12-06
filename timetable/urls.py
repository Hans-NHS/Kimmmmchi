
from django.urls import path
from . import views

urlpatterns = [
    path('fetch-mylist/', views.fetch_mylist_id, name='fetch_mylist'),
    path('fetch-mylistclasses/', views.fetch_mylistclasses, name='fetch_mylistclasses'),
    path('fetch_class_details/', views.fetch_class_details, name='fetch_class_details'),
    path('fetch_and_generate/', views.fetch_and_generate, name='fetch_and_generate'),
    path('create_and_store/', views.create_and_store, name='create_and_store'),
    path('timetable_main/', views.timetable_main, name='timetable_main'),
]


