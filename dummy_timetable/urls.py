# dummy_timetable/urls.py
from django.urls import path
from .views import generate_dummy_timetable
from . import views

urlpatterns = [
    path('fetch-data/', views.fetch_data_view, name='fetch_data'),
    path('fetch-course/<int:course_id>/', views.fetch_course_by_id, name='fetch_course_by_id'), 
    path('insert-data/', views.insert_data_view, name='insert_data'),
    path('generate/', generate_dummy_timetable, name='generate_dummy_timetable'),
]