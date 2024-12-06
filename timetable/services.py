# from core.supabase_client import get_supabase_client

# # def fetch_mylist(user_id, year, semester):
# #     """Fetch the user's MyList data."""
# #     response = get_supabase_client.table('MyList').select('*').eq('user_id', user_id).eq('year', year).eq('semester', semester).execute()
# #     return response.data

# def fetch_courses(mylist_id):
#     """Fetch courses linked to the MyList."""
#     response = get_supabase_client.table('MyListClasses').select('class_id, required_or_not').eq('mylist_id', mylist_id).execute()
#     return response.data

# def fetch_course_details(course_ids):
#     """Fetch course details including timeslot and credit."""
#     response = get_supabase_client.table('Courses').select('course_id, timeslot, credit').in_('course_id', course_ids).execute()
#     return response.data

# def generate_timetable(courses, required_credits):
#     """Generate the timetable ensuring no overlap."""
#     timetable = []
#     total_credits = 0

#     # Step 1: Add required courses
#     for course in [c for c in courses if c['required_or_not'] == 'required']:
#         if not check_overlap(timetable, course['timeslot']):
#             timetable.append(course)
#             total_credits += course['credit']
    
#     # Step 2: Add optional courses until credits are met
#     for course in [c for c in courses if c['required_or_not'] == 'optional']:
#         if total_credits >= required_credits:
#             break
#         if not check_overlap(timetable, course['timeslot']):
#             timetable.append(course)
#             total_credits += course['credit']

#     return {
#         'total_credits': total_credits,
#         'timetable': timetable
#     }

# def check_overlap(timetable, timeslot):
#     """Check if a timeslot overlaps with the existing timetable."""
#     for entry in timetable:
#         if entry['timeslot'] == timeslot:
#             return True
#     return False

# def save_timetable(user_id, timetable_data):
#     """Save the generated timetable to the database."""
#     # Save timetable
#     response = get_supabase_client.table('timetables').insert({
#         'user_id': user_id,
#         'total_credits': timetable_data['total_credits']
#     }).execute()
#     timetable_id = response.data[0]['timetable_id']

#     # Save timetable classes
#     for entry in timetable_data['timetable']:
#         get_supabase_client.table('timetableClasses').insert({
#             'timetable_id': timetable_id,
#             'class_id': entry['course_id'],
#             'timeslot': entry['timeslot']
#         }).execute()

#     return timetable_id
