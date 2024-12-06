from django.http import JsonResponse
from core.supabase_utils import fetch_data, insert_data
from .utils import TimetableGenerator
import json
import logging
logger = logging.getLogger(__name__)

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

# timetable generation step 1 : fetch_mylist_id -> fetch_mylistclasses -> fetch_class_details -> generate_timetable
def fetch_and_generate(request):
    # GET query parameters
    user_id = request.GET.get("user_id")
    semester = request.GET.get("semester")
    desired_credits = request.GET.get("desired_credits")

    if not user_id or not semester:
        return JsonResponse({"error": "Both 'user_id' and 'semester' are required."}, status=400)

    try:
        semester = int(semester)
        desired_credits = int(desired_credits)

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

        timetable_generator = TimetableGenerator(course_details, desired_credits)
        result = timetable_generator.generate_timetable()

        if isinstance(result, str): # Error message
            return JsonResponse({"error": result}, status=400)
        else: # Normal timetable output
            return JsonResponse({
            "total_credits": result['total_credits'],
            "course_ids": result['course_ids']
        })

    except ValueError:
        return JsonResponse({"error": "'semester' must be an integer and 'desired_credits' must be a number."}, status=400)
    except Exception as e:
        logger.error(f"Error generating timetable: {str(e)}")
        return JsonResponse({"error": "An unexpected error occurred."}, status=500)

# timetable generation step 2 : create timetable record & upload course_ids to timetableclasses
def create_and_store(user_id, total_credits, course_ids):
    try:
        # Prepare timetable data
        timetable_data = {
            "user_id": user_id,
            "total_credits": total_credits,
        }

        # Insert timetable record
        timetable_insert_response = insert_data("timetables", timetable_data)

        logger.debug(f"Timetable insert response: {timetable_insert_response}")

        if not timetable_insert_response or not isinstance(timetable_insert_response, list):
            return JsonResponse({"error": "Failed to retrieve timetable_id from insert response."}, status=500)

        # Extract timetable_id from the response
        timetable_id = timetable_insert_response[0].get("timetable_id")
        if not timetable_id:
            return JsonResponse({"error": "Failed to retrieve timetable_id from response data."}, status=500)

        # Prepare timetable classes data
        timetable_classes_data = [
            {"timetable_id": timetable_id, "course_id": course_id}
            for course_id in course_ids
        ]

        # Insert timetable classes
        timetable_classes_insert_response = insert_data("timetableclasses", timetable_classes_data)

        logger.debug(f"Timetable classes insert response: {timetable_classes_insert_response}")

        if not timetable_classes_insert_response:
            return JsonResponse({"error": "Failed to insert timetable classes."}, status=500)

        return JsonResponse({
            "message": "Timetable and classes created successfully.",
            "timetable_id": timetable_id
        }, status=201)

    except Exception as e:
        logger.error(f"Error in create_and_store: {str(e)}")
        return JsonResponse({"error": f"An unexpected error occurred: {str(e)}"}, status=500)

#fetch -> generate -> store
def timetable_main(request):
    fetch_response = fetch_and_generate(request)
    if fetch_response.status_code != 200:
        return fetch_response  # Return error response from fetch_and_generate

    fetch_data = json.loads(fetch_response.content.decode('utf-8'))
    user_id = request.GET.get("user_id")

    # Call create_and_store to save the data
    return create_and_store(
        user_id=user_id,
        total_credits=fetch_data["total_credits"],
        course_ids=fetch_data["course_ids"],
    )