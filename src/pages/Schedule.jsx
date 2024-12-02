import React, { useState, useEffect } from 'react';
import { Download, AlertCircle } from 'lucide-react';

// Mock data structure for testing - remove or replace with your actual data
const mockSavedCourses = [
  {
    course_id: 1,
    course_code: "CSE2030",
    course_name: "Computer Programming I",
    credits: 3,
    schedule: "MON 09:00-10:30",
    location: "AS 818",
  },
  {
    course_id: 2,
    course_code: "CSE3020",
    course_name: "Data Structures",
    credits: 3,
    schedule: "TUE 10:30-12:00",
    location: "AS 819",
  },
  {
    course_id: 2,
    course_code: "CSE3020",
    course_name: "Data Structures",
    credits: 3,
    professor: "Dr. Smith",
    schedule: "TUE 10:30-12:00",  // Changed to match the format we need
    location: "AS 819",
    capacity: "35 students",
    current_enrolled: 30,
    english_class: true,
    semester: "Spring 2024",
    department: "Computer Science"
  }
];
const Schedule = ({ savedCourses = mockSavedCourses }) => {
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [totalCredits, setTotalCredits] = useState(0);
  const [error, setError] = useState('');

  const timeSlots = [
    '09:00-10:30', '10:30-12:00', '12:00-13:30',
    '13:30-15:00', '15:00-16:30', '16:30-18:00'
  ];

  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

  useEffect(() => {
    const credits = selectedCourses.reduce((sum, course) => sum + course.credits, 0);
    setTotalCredits(credits);

    if (credits > 21) {
      setError('You have exceeded the maximum of 21 credits');
    } else if (credits < 9) {
      setError('You need at least 9 credits');
    } else {
      setError('');
    }
  }, [selectedCourses]);

  const toggleCourse = (course) => {
    if (selectedCourses.find(c => c.course_id === course.course_id)) {
      setSelectedCourses(selectedCourses.filter(c => c.course_id !== course.course_id));
    } else {
      const newTotal = totalCredits + course.credits;
      if (newTotal > 21) {
        alert('Adding this course would exceed the maximum of 21 credits');
        return;
      }

      // Check for time conflicts
      const hasConflict = selectedCourses.some(existingCourse => {
        return isTimeConflict(existingCourse, course);
      });

      if (hasConflict) {
        alert('This course conflicts with another selected course');
        return;
      }

      setSelectedCourses([...selectedCourses, course]);
    }
  };

  const isTimeConflict = (course1, course2) => {
    if (!course1.schedule || !course2.schedule) return false;
    
    const [day1] = course1.schedule.split(' ');
    const [day2] = course2.schedule.split(' ');
    
    if (day1 === day2) {
      const time1 = course1.schedule.split(' ')[1];
      const time2 = course2.schedule.split(' ')[1];
      return time1 === time2;
    }
    return false;
  };

  const getCellContent = (day, timeSlot) => {
    return selectedCourses.filter(course => {
      if (!course.schedule) return false;
      const [courseDay, courseTime] = course.schedule.split(' ');
      return courseDay === day && courseTime === timeSlot;
    });
  };

  const downloadScheduleAsText = () => {
    let scheduleText = 'My Class Schedule\n\n';
    scheduleText += `Total Credits: ${totalCredits}\n\n`;
    
    // Add course list
    scheduleText += 'Courses:\n';
    selectedCourses.forEach(course => {
      scheduleText += `- ${course.course_code}: ${course.course_name}\n`;
      scheduleText += `  Credits: ${course.credits}, Schedule: ${course.schedule}\n`;
      scheduleText += `  Location: ${course.location}\n\n`;
    });

    // Create and download the file
    const blob = new Blob([scheduleText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'class-schedule.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Early return if savedCourses is not available
  if (!Array.isArray(savedCourses)) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Class Schedule</h1>
        <div className="text-gray-500">No courses available. Please add courses to your list first.</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Class Schedule</h1>
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg">
            Total Credits: <span className={`font-bold ${totalCredits < 9 || totalCredits > 21 ? 'text-red-600' : 'text-green-600'}`}>
              {totalCredits}
            </span> / 21
          </div>
          <button
            onClick={downloadScheduleAsText}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Schedule
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 mb-4">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Course Selection */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Available Courses</h2>
          <div className="space-y-2">
            {savedCourses.map(course => (
              <div
                key={course.course_id}
                className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
              >
                <div>
                  <div className="font-medium">{course.course_name}</div>
                  <div className="text-sm text-gray-500">
                    {course.course_code} • {course.credits} Credits • {course.schedule}
                  </div>
                </div>
                <button
                  onClick={() => toggleCourse(course)}
                  className={`px-3 py-1 rounded ${
                    selectedCourses.find(c => c.course_id === course.course_id)
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }`}
                >
                  {selectedCourses.find(c => c.course_id === course.course_id)
                    ? 'Remove'
                    : 'Add'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Table */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 bg-gray-50">Time</th>
                  {weekDays.map(day => (
                    <th key={day} className="border p-2 bg-gray-50">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((timeSlot) => (
                  <tr key={timeSlot}>
                    <td className="border p-2 bg-gray-50 font-medium">
                      {timeSlot}
                    </td>
                    {weekDays.map(day => {
                      const courses = getCellContent(day, timeSlot);
                      return (
                        <td key={`${day}-${timeSlot}`} className="border p-2">
                          {courses.map(course => (
                            <div key={course.course_id} className="text-sm">
                              <div className="font-medium">{course.course_code}</div>
                              <div className="text-gray-500">{course.location}</div>
                            </div>
                          ))}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;