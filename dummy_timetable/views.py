# dummy_timetable/views.py
from django.http import JsonResponse
from .services import generate_timetable

from django.http import JsonResponse
from core.supabase_utils import fetch_from_supabase, insert_to_supabase

def generate_dummy_timetable(request):
    # Get the desired credits from the query parameters
    credits = float(request.GET.get('credits', 15.0))  # Default to 15.0 if not provided
    
    try:
        # Generate the timetable based on the given credits
        timetable = generate_timetable(credits)
        
        # Return the generated timetable as JSON
        return JsonResponse({"timetable": timetable})
    
    except ValueError as e:
        return JsonResponse({"error": str(e)}, status=400)

def fetch_data_view(request):
    data = fetch_from_supabase('courses')
    return JsonResponse(data, safe=False)

def fetch_course_by_id(request, course_id):
    filters = {"course_id": course_id}
    data = fetch_from_supabase('courses', filters=filters)
    return JsonResponse(data, safe=False)

# user_id -> year, semester
def fetch_user_semester(request, user_id):
    filters = {"user_id": user_id}
    data = fetch_from_supabase('users', filters=filters)
    return JsonResponse(data, safe=False)


def insert_data_view(request):
    if request.method == 'POST':
        data = request.POST.dict()
        response = insert_to_supabase('your_table_name', data)
    return JsonResponse(response, safe=False)

