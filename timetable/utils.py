class TimetableGenerator:
    def __init__(self, courses, desired_credits):
        """
        Initialize the generator.
        Args:
            courses (list): List of dictionaries containing course details.
            desired_credits (float): Total credits the user wants for the semester.
        """
        self.courses = courses
        self.desired_credits = desired_credits
        self.timetable = []
        self.total_credits = 0.0


    def has_conflict(self, new_timeslot):
        """
        Check for conflicts in the current timetable.

        Args:
            new_timeslot (str): The timeslot of the class to check.

        Returns:
            bool: True if there is a conflict, False otherwise.
        """
        for entry in self.timetable:
            existing_timeslot = entry['timeslot']
            if existing_timeslot == new_timeslot:
                return True
        return False

    def add_required_classes(self):
        """
        Add all required classes to the timetable, resolving conflicts by raising an error.
        """
        for course in self.courses:
            if course['required_or_not'] == 'required':
                class_id = course['course_id']
                timeslot = course['timeslot']
                credits = course['credit']

                if self.has_conflict(timeslot):
                    raise ValueError(f"Conflict detected for required class {class_id} at timeslot {timeslot}.")

                self.timetable.append({'course_id': class_id, 'timeslot': timeslot})
                self.total_credits += credits

    def add_optional_classes(self):
        """
        Add optional classes to fill remaining credits, resolving conflicts by skipping classes.
        """
        for course in self.courses:
            if course['required_or_not'] == 'optional' and self.total_credits < self.desired_credits:
                class_id = course['course_id']
                timeslot = course['timeslot']
                credits = course['credit']

                if self.has_conflict(timeslot):
                    continue

                self.timetable.append({'course_id': class_id, 'timeslot': timeslot})
                self.total_credits += credits

    def generate_timetable(self):
        """
        Generate the timetable based on required and optional classes.

        Returns:
            dict: The generated timetable and total credits.
        """
        self.add_required_classes()
        self.add_optional_classes()

        return {
            'timetable': self.timetable,
            'total_credits': round(self.total_credits, 1)  # Ensure total credits are rounded to 1 decimal place
        }

# New data structure
courses = [
    {
        "course_id": 1,
        "course_code": "CSE2003",
        "course_name": "컴퓨터프로그래밍I",
        "credit": 3.0,
        "timeslot": "화,목 15:00~16:15",
        "required_or_not": "required"
    },
    {
        "course_id": 7,
        "course_code": "CSE3013",
        "course_name": "소프트웨어개발도구및환경실습",
        "credit": 6.0,
        "timeslot": "금 15:00~20:50",
        "required_or_not": "required"
    },
    {
        "course_id": 24,
        "course_code": "CSE4110",
        "course_name": "데이터베이스시스템",
        "credit": 3.0,
        "timeslot": "월,수 16:30~17:45",
        "required_or_not": "required"
    },
    {
        "course_id": 29,
        "course_code": "CSE4170",
        "course_name": "기초컴퓨터그래픽스",
        "credit": 3.0,
        "timeslot": "화,목 12:00~13:15",
        "required_or_not": "optional"
    },
    {
        "course_id": 50,
        "course_code": "CSE3016",
        "course_name": "컴퓨터공학실험II",
        "credit": 6.0,
        "timeslot": "월 15:00~20:50",
        "required_or_not": "optional"
    }
]

desired_credits = 18.0

# Generate timetable
generator = TimetableGenerator(courses, desired_credits)
result = generator.generate_timetable()
print(result)
