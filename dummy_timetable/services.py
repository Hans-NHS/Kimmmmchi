# dummy_timetable/services.py
from .dummy_data import DUMMY_COURSES

def fetch_dummy_timetable():
    # Simply return all courses as there is no filtering in this case
    return DUMMY_COURSES

# dummy_timetable/services.py
from .dummy_data import DUMMY_COURSES

TIME_SLOTS = [
    "09:00~10:15", "10:30~11:45", "12:00~13:15", "13:30~14:45", 
    "15:00~16:15", "16:30~17:45", "18:00~19:15", "19:30~20:45", 
    "21:00~22:15", "22:30~23:45"
]

DAYS_OF_WEEK = ['월', '화', '수', '목', '금', '토', '일']

# Helper function to convert course time to time slots
def time_to_slots(time_str):

    days = {
        '월': 0, '화': 1, '수': 2, '목': 3, '금': 4, '토': 5, '일': 6
    }
    slots = set()

    # Example: "화,목 15:00~16:15" => convert to specific time slots
    days_of_week, time_range = time_str.split(' ')
    start_time, end_time = time_range.split('~')

    start_hour, start_minute = map(int, start_time.split(':'))
    end_hour, end_minute = map(int, end_time.split(':'))
    
    start_slot = TIME_SLOTS.index(f"{start_hour:02}:{start_minute:02}~{start_hour:02}:{start_minute + 15:02}")
    end_slot = TIME_SLOTS.index(f"{end_hour:02}:{end_minute:02}~{end_hour:02}:{end_minute + 15:02}")
    
    for day in days_of_week.split(','):
        day_index = days[day]
        for slot in range(start_slot, end_slot + 1):
            slots.add((day_index, slot))  # Add this slot to the timetable
    return slots

# Generate a timetable based on user input
def generate_timetable(credits_desired):
    if credits_desired < 9.0 or credits_desired > 21.0:
        raise ValueError("Credits must be between 9.0 and 21.0")

    timetable = []
    total_credits = 0

    # Initialize an empty 7-day timetable with 10 time slots each day
    grid = [[None for _ in range(10)] for _ in range(7)]  # 7 days, 10 time slots

    # Add required courses first
    for course in DUMMY_COURSES:
        if course['required'] == 'required' and total_credits + float(course['credits']) <= credits_desired:
            slots = time_to_slots(course['time'])

            # Check if the slots are available
            if all(grid[day][slot] is None for day, slot in slots):
                for day, slot in slots:
                    grid[day][slot] = course['course_id']  # Mark the slot
                timetable.append(course)
                total_credits += float(course['credits'])
            else :
                raise ValueError("Ensure required classes do not overlap!")
    
    # Add optional courses if there are remaining credits
    if total_credits < credits_desired:
        for course in DUMMY_COURSES:
            if course['required'] == 'optional' and total_credits + float(course['credits']) <= credits_desired:
                slots = time_to_slots(course['time'])

                # Check if the slots are available
                if all(grid[day][slot] is None for day, slot in slots):
                    for day, slot in slots:
                        grid[day][slot] = course['course_id']  # Mark the slot
                    timetable.append(course)
                    total_credits += float(course['credits'])
    
    return timetable
