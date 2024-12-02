import React from 'react';
import { Trash2, Share2, Download } from 'lucide-react';

const MyList = ({ savedCourses, onRemoveCourse }) => {
  const handleShare = async () => {
    try {
      const shareText = savedCourses
        .map(course => `${course.course_code}: ${course.course_name}`)
        .join('\n');
      await navigator.clipboard.writeText(shareText);
      alert('Course list copied to clipboard!');
    } catch (error) {
      alert('Failed to share list');
    }
  };

  const handleExport = () => {
    try {
      const csvContent = [
        ['Course Code', 'Course Name', 'Professor', 'Schedule', 'Credits'],
        ...savedCourses.map(course => [
          course.course_code,
          course.course_name,
          course.professor,
          course.schedule,
          course.credits
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'my-courses.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert('Failed to export list');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Course List</h1>
          <div className="flex gap-2">
            <button 
              onClick={handleShare}
              className="inline-flex items-center px-3 py-2 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </button>
            <button 
              onClick={handleExport}
              className="inline-flex items-center px-3 py-2 rounded-md bg-green-50 text-green-600 hover:bg-green-100"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        <div className="p-4">
          {savedCourses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No courses in your list yet. Go to Course List to add some!
            </div>
          ) : (
            <div className="divide-y">
              {savedCourses.map((course) => (
                <div key={course.course_id} className="py-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{course.course_name}</h3>
                    <p className="text-sm text-gray-500">
                      {course.course_code} • {course.credits} Credits • {course.schedule}
                    </p>
                    <p className="text-sm text-gray-500">
                      Professor: {course.professor}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveCourse(course.course_id)}
                    className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyList;