from django.http import JsonResponse
from core.supabase_utils import fetch_data, insert_data
from .utils import TimetableGenerator
import json

#GET request + user_id & semester -> mylist_id
def fetch_mylist_id(request):
    # GET query parameters
    user_id = request.GET.get("user_id")
    semester = request.GET.get("semester")

    if not user_id or not semester:
        return JsonResponse({"error": "Both 'user_id' and 'semester' are required."}, status=400)

    # fetch 
    try:
        # Convert semester to integer (you can also add additional validation here)
        semester = int(semester)

        # filters query 
        filters = {"user_id": user_id, "semester": semester}
        mylist = fetch_data("mylist", filters)

        if mylist:
            mylist_ids = [item["mylist_id"] for item in mylist] 
            return JsonResponse({"mylist_ids": mylist_ids}, safe=False)
        else:
            return JsonResponse({"error": "No mylist found for the given user and semester."}, status=404)

    except ValueError:
        return JsonResponse({"error": "'semester' must be an integer."}, status=400)

#GET request + mylist_id -> course_id & required_or_not
def fetch_mylistclasses(request):
    # GET query parameters
    mylist_id = request.GET.get("mylist_id")
    if not mylist_id:
        return JsonResponse({"error": "'mylist_id' is required."}, status=400)

    # fetch
    try:
        mylist_id = int(mylist_id) # Convert mylist_id to integer (validation)

        # Query the mylistclasses table for course_id and required_or_not based on mylist_id
        mylist_classes_filters = {"mylist_id": mylist_id}
        mylist_classes = fetch_data("mylistclasses", mylist_classes_filters)
        if not mylist_classes:
            return JsonResponse({"error": "No classes found for the given mylist_id."}, status=404)

        # Extract course_id and required_or_not from the mylistclasses records
        courses = [{"course_id": item["course_id"], "required_or_not": item["required_or_not"]} for item in mylist_classes]

        return JsonResponse({"courses": courses}, safe=False)

    except ValueError:
        # Handle case where mylist_id is not a valid integer
        return JsonResponse({"error": "'mylist_id' must be an integer."}, status=400)

#GET request + course_id -> timeslot, credit, and course_name & couse_code
def fetch_class_details(request):
    # GET query parameters
    course_id = request.GET.get("course_id")
    if not course_id:
        return JsonResponse({"error": "'course_id' is required."}, status=400)

    try:
        course_id = int(course_id)

        # Query the courses table for timeslot, credit, course_name, and course_code based on course_id
        courses_filters = {"course_id": course_id}
        course_details = fetch_data("courses", courses_filters)
        if not course_details:
            return JsonResponse({"error": "No course found for the given course_id."}, status=404)

        # Extract course details
        course = {
            "course_id": course_details[0]["course_id"],
            "course_code": course_details[0]["course_code"],
            "course_name": course_details[0]["course_name"],
            "credit": course_details[0]["credit"],
            "timeslot": course_details[0]["timeslot"]
        }

        return JsonResponse({"course": course}, safe=False)

    except ValueError:
        return JsonResponse({"error": "'course_id' must be an integer."}, status=400)

# timetable generation step 1 : fetch_mylist_id -> fetch_mylistclasses -> fetch_class_details
def fetch_combined_details(request):
    # GET query parameters
    user_id = request.GET.get("user_id")
    semester = request.GET.get("semester")
    if not user_id or not semester:
        return JsonResponse({"error": "Both 'user_id' and 'semester' are required."}, status=400)

    try:
        semester = int(semester)

        # Step 1: Fetch mylist_id using user_id and semester
        mylist_filters = {"user_id": user_id, "semester": semester}
        mylist_data = fetch_data("mylist", mylist_filters)
        if not mylist_data:
            return JsonResponse({"error": "No mylist found for the given user and semester."}, status=404)

        # Extract the mylist_id from the data
        mylist_id = mylist_data[0]["mylist_id"]

        # Step 2: Fetch courses for the mylist_id
        mylist_classes_filters = {"mylist_id": mylist_id}
        mylist_classes_data = fetch_data("mylistclasses", mylist_classes_filters)
        if not mylist_classes_data:
            return JsonResponse({"error": "No classes found for the given mylist_id."}, status=404)

        # Step 3: For each course, fetch class details (course_id, timeslot, credit, etc.)
        course_details = []
        for mylist_class in mylist_classes_data:
            course_id = mylist_class["course_id"]

            # Fetch course details
            courses_filters = {"course_id": course_id}
            course_data = fetch_data("courses", courses_filters)
            if not course_data:
                continue  

            # Extract the course details
            course = {
                "course_id": course_data[0]["course_id"],
                "course_code": course_data[0]["course_code"],
                "course_name": course_data[0]["course_name"],
                "credit": course_data[0]["credit"],
                "timeslot": course_data[0]["timeslot"],
                "required_or_not": mylist_class["required_or_not"]
            }
            course_details.append(course)

        # combine course details as JSON
        return JsonResponse({"courses": course_details}, safe=False)

    except ValueError:
        return JsonResponse({"error": "'semester' must be an integer."}, status=400)


import logging
logger = logging.getLogger(__name__)
# create timetable & insert into it
def create_timetable(request):
    try:
        # Hardcoded data for now
        timetable_data = {
            "user_id": "f81171fe-636b-4113-a8a1-f7a83c17238a",
            "total_credits": 12
        }

        # Insert timetable record into the 'timetables' table
        timetable = insert_data("timetables", timetable_data)
        if not timetable:
            return JsonResponse({"error": "Failed to create timetable."}, status=500)

        # Extract timetable_id from the inserted data
        timetable_id = timetable[0]["timetable_id"]

        # Hardcoded list of course IDs (example)
        course_ids = [1, 7, 24]

        timetable_classes_data = [
            {"timetable_id": timetable_id, "course_id": course_id}
            for course_id in course_ids
        ]

        # Insert into 'timetableclasses' table
        timetable_classes = insert_data("timetableclasses", timetable_classes_data)
        if not timetable_classes:
            return JsonResponse({"error": "Failed to insert timetable classes."}, status=500)

        return JsonResponse({"message": "Timetable and associated classes inserted successfully."})

    except Exception as e:
        return JsonResponse({"error": f"Error in create_timetable: {str(e)}"}, status=500)






# timetable generation algorithm
def generate_timetable(request):
    user_id = request.GET.get("user_id")
    semester = request.GET.get("semester")
    desired_credits = request.GET.get("desired_credits")
    
    if not user_id or not semester or not desired_credits:
        return JsonResponse({"error": "All 'user_id', 'semester', and 'desired_credits' are required."}, status=400)

    try:
        # Convert inputs to appropriate types
        semester = int(semester)
        desired_credits = float(desired_credits)

        # Step 1 & 2: Fetch combined course details by calling the function directly
        fetch_response = fetch_combined_details(request)
        if fetch_response.status_code != 200:
            return fetch_response  # Return the error response if any

        # Parse the JSON response
        combined_details = json.loads(fetch_response.content.decode("utf-8"))

        # Extract data for the algorithm
        courses = combined_details["courses"]
        mylist = [{"class_ID": course["course_id"], "type": course["required_or_not"]} for course in courses]
        class_details = {
            course["course_id"]: {
                "timeslot": course["timeslot"],
                "credits": course["credit"]
            }
            for course in courses
        }

        # Step 3: Run the TimetableGenerator algorithm
        generator = TimetableGenerator(mylist, class_details, desired_credits)
        result = generator.generate_timetable()

        # Return the generated timetable
        return JsonResponse(result, safe=False)

    except ValueError:
        return JsonResponse({"error": "'semester' must be an integer and 'desired_credits' must be a number."}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)