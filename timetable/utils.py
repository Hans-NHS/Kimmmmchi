from datetime import datetime

class TimetableGenerator:
    def __init__(self, mylist, desired_credits):
        """
        Initialize the generator with list of classes and the desired total credits.
        Args:
            mylist (list): List of dictionaries containing course details (course_id, timeslot, credit, required_or_not).
            desired_credits (float): The total credits the user wants for the semester.
        """
        self.mylist = mylist
        self.desired_credits = desired_credits
        self.timetable = {'월': [], '화': [], '수': [], '목': [], '금': []}  # Separate timetable by day
        self.total_credits = 0.0
        self.final_course_ids = []  # To store final list of course IDs added to the timetable
        self.required_courses = []  # List to track required courses

        # Separate required and optional courses for later handling
        for course in mylist:
            if course['required_or_not'] == 'required':
                self.required_courses.append(course)

    def parse_timeslot(self, timeslot):
        """
        Convert a timeslot string to a tuple of days and start and end datetime objects.
        Assumes the timeslot is in the format: 'Day 15:00~16:15'.
        """
        days, time_range = timeslot.split(' ')
        start_time, end_time = time_range.split('~')
        
        # Parse the start and end times into datetime objects
        start_time = datetime.strptime(start_time, "%H:%M")
        end_time = datetime.strptime(end_time, "%H:%M")
        
        # Convert times to minutes from midnight for easy comparison
        start_minutes = start_time.hour * 60 + start_time.minute
        end_minutes = end_time.hour * 60 + end_time.minute
        
        return (days.split(','), start_minutes, end_minutes)  # Return days as a list, times as minutes

    def has_conflict(self, new_timeslot):
        """
        Check if the new course timeslot conflicts with any existing course in the timetable.
        Args:
            new_timeslot (str): The timeslot of the course to check.
        Returns:
            bool: True if there's a conflict, False otherwise.
        """
        new_days, new_start, new_end = self.parse_timeslot(new_timeslot)

        # Iterate through each day the course is scheduled
        for day in new_days:
            # Check for overlap on the specific day
            for entry in self.timetable[day]:
                existing_start, existing_end = entry['timeslot']
                # If the times overlap on any day, return True (conflict)
                if (new_start < existing_end and new_end > existing_start):
                    return True  # Conflict found
        
        return False  # No conflict found

    def add_classes(self):
        """
        Add required and optional classes to the timetable while respecting conflicts and credit limits.
        """
        # Track whether we successfully added all required courses
        required_courses_added = set()
        
        # First, calculate the minimum required credits for the required courses
        min_required_credits = sum(course['credit'] for course in self.required_courses)
        
        # If the desired credits are less than the minimum required, return an error
        if self.desired_credits < min_required_credits:
            return f"Error: You cannot request less than {min_required_credits} credits for the required courses."

        # First, prioritize required courses
        for course in sorted(self.mylist, key=lambda x: x['required_or_not'] == 'optional'):
            timeslot = course['timeslot']
            credits = course['credit']
            
            # Ensure there's no conflict and credit limit isn't exceeded
            if self.total_credits + credits <= self.desired_credits and not self.has_conflict(timeslot):
                new_days, new_start, new_end = self.parse_timeslot(timeslot)
                
                # Add the course to the timetable for each of the days it occurs
                for day in new_days:
                    # Store start and end times as minutes for that day
                    self.timetable[day].append({'course_id': course['course_id'], 'timeslot': (new_start, new_end)})  
                
                self.total_credits += credits
                self.final_course_ids.append(course['course_id'])  # Add to the final course list
                required_courses_added.add(course['course_id'])  # Mark as added
                
                # Stop if we reach or exceed the desired credits
                if self.total_credits >= self.desired_credits:
                    break
        
        # After attempting to add all courses, check if all required courses are added
        missing_required_courses = [course for course in self.required_courses if course['course_id'] not in required_courses_added]
        
        if missing_required_courses:
            missing_courses_ids = [course['course_id'] for course in missing_required_courses]
            return f"Error: Could not fit the following required courses due to time conflicts or credit limitations: {', '.join(map(str, missing_courses_ids))}"

        return None  # No error, we successfully added courses

    def generate_timetable(self):
        """
        Generate the timetable based on input, ensuring no conflicts and total credits are <= desired credits.
        Returns:
            dict: Total credits and list of course_ids included in the timetable.
        """
        error_message = self.add_classes()
        if error_message:
            return error_message  # Return the error message if something went wrong
        
        return {
            'total_credits': round(self.total_credits, 1),  # Ensure total credits are rounded to 1 decimal place
            'course_ids': sorted(self.final_course_ids)  # Sort course IDs for final output
        }
