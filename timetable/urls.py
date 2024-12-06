
from django.urls import path
from . import views

urlpatterns = [
    path('fetch-mylist/', views.fetch_mylist_id, name='fetch_mylist'),
    path('fetch-mylistclasses/', views.fetch_mylistclasses, name='fetch_mylistclasses'),
    path('fetch_class_details/', views.fetch_class_details, name='fetch_class_details'),
    path('fetch_combined_details/', views.fetch_combined_details, name='fetch_combined_details'),

    path('generate_timetable/', views.generate_timetable, name='generate_timetable'),

    path("create-timetable/", views.create_timetable, name="create_timetable"),


]


