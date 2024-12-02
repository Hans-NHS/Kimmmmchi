import { useState } from 'react';
import { Search, X, Filter, Clock, Calendar } from 'lucide-react';

export default function CourseList({ onAddCourse, savedCourses }){
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [totalCredits, setTotalCredits] = useState(0);
  const [advancedSearch, setAdvancedSearch] = useState(false);

  // Advanced time filters
  const periods = [
    { id: '1', name: '1st Period (1교시)', time: '9:00-10:30' },
    { id: '2', name: '2nd Period (2교시)', time: '10:30-12:00' },
    { id: '3', name: '3rd Period (3교시)', time: '12:00-13:30' },
    { id: '4', name: '4th Period (4교시)', time: '13:30-15:00' },
    { id: '5', name: '5th Period (5교시)', time: '15:00-16:30' },
    { id: '6', name: '6th Period (6교시)', time: '16:30-18:00' },
  ];

  const weekDays = [
    { id: 'MON', name: 'Monday' },
    { id: 'TUE', name: 'Tuesday' },
    { id: 'WED', name: 'Wednesday' },
    { id: 'THU', name: 'Thursday' },
    { id: 'FRI', name: 'Friday' },
  ];

  // Search fields configuration
  const searchFields = [
    { key: 'course_code', label: 'Course Code' },
    { key: 'course_name', label: 'Course Name' },
    { key: 'professor', label: 'Professor' },
    { key: 'description', label: 'Description' },
    { key: 'prerequisites', label: 'Prerequisites' },
  ];

  // Enhanced filters
  const [filters, setFilters] = useState({
    semester: '',
    department: '',
    language: '',
    credits: '',
    professor: '',
    scheduleDay: '',
    schedulePeriod: '',
    classType: '',
    academicLevel: '',
    timeOfDay: '',
    requirements: '',
    instructionType: '',
    availableSeats: '',
    examType: '',
    weekDay: '',
    period: '',
    engineeringCert: '',
    honors: '',
    international: '',
    cuClass: '',
    oddEven: '',
});

  const mockCourses = [
    {
      course_id: 1,
      course_code: "CSE2030",
      course_name: "Computer Programming I",
      credits: 3,
      professor: "Dr. Joo Ho Lee",
      schedule: "Tue, Thu 15:30-14:45",
      days: ["TUE", "THU"],
      period: "5",
      location: "AS 818",
      capacity: "40 students",
      current_enrolled: 35,
      english_class: true,
      semester: "Spring 2024",
      department: "Computer Science",
      classType: "lecture",
      academicLevel: "freshman",
      instructionType: "offline",
      examType: "traditional",
      prerequisites: "None",
      engineeringCertification: false,
        honors_class: false,
        international_students: false,
        cu_class: false,
        odd_even: 'odd',
      description: "An introductory course to C programming language. Students will learn the required background knowledge, including memory management, pointers, preprocessor macros, and debugging skills.",
      weeklySchedule: [
        { week: 1, topic: "C Programming Overview", content: "Introduction. Writing, compiling, and debugging C programs." },
        { week: 2, topic: "Variables and Operators", content: "Basic data types, operators, expressions" }
      ]
    },
    // ... your other mock courses ...
  ];

  const [courses, setCourses] = useState(mockCourses);

  const filterCourses = (searchValue, currentFilters) => {
    let filtered = mockCourses;

    // Search filter
    if (searchValue) {
      filtered = filtered.filter(course => 
        course.course_name.toLowerCase().includes(searchValue.toLowerCase()) ||
        course.course_code.toLowerCase().includes(searchValue.toLowerCase()) ||
        course.professor.toLowerCase().includes(searchValue.toLowerCase()) ||
        course.description.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Apply filters
    if (currentFilters.weekDay) {
      filtered = filtered.filter(course => course.days.includes(currentFilters.weekDay));
    }

    if (currentFilters.period) {
      filtered = filtered.filter(course => course.period.includes(currentFilters.period));
    }

    if (currentFilters.credits) {
      filtered = filtered.filter(course => course.credits.toString() === currentFilters.credits);
    }

    if (currentFilters.classType) {
      filtered = filtered.filter(course => course.classType === currentFilters.classType);
    }

    if (currentFilters.academicLevel) {
      filtered = filtered.filter(course => course.academicLevel === currentFilters.academicLevel);
    }

    if (currentFilters.instructionType) {
      filtered = filtered.filter(course => course.instructionType === currentFilters.instructionType);
    }

    if (currentFilters.examType) {
      filtered = filtered.filter(course => course.examType === currentFilters.examType);
    }

    if (currentFilters.requirements) {
      filtered = filtered.filter(course => 
        currentFilters.requirements === 'none' ? 
          course.prerequisites === 'None' : 
          course.prerequisites !== 'None'
      );
    }
    
    if (currentFilters.engineeringCert) {
        filtered = filtered.filter(course => course.engineeringCertification === (currentFilters.engineeringCert === 'yes'));
      }
    
    if (currentFilters.honors) {
    filtered = filtered.filter(course => course.honors_class === (currentFilters.honors === 'yes'));
    }

    if (currentFilters.international) {
    filtered = filtered.filter(course => course.international_students === (currentFilters.international === 'yes'));
    }

    if (currentFilters.cuClass) {
    filtered = filtered.filter(course => course.cu_class === (currentFilters.cuClass === 'yes'));
    }

    if (currentFilters.oddEven) {
    filtered = filtered.filter(course => course.odd_even === currentFilters.oddEven);
    }

    setCourses(filtered);
  };

  const handleSearch = (value, field = 'all') => {
    if (field === 'all') {
      setSearchTerm(value);
    } else {
      setSearchTerm(prev => ({ ...prev, [field]: value }));
    }
    filterCourses(value, filters);
  };

  // Filter component
  const FilterSelect = ({ label, value, onChange, options }) => (
    <div className="flex flex-col space-y-1">
      <label className="text-sm text-gray-600">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  // Advanced search toggle
  const AdvancedSearchPanel = () => (
    <div className="bg-white rounded-lg border p-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {searchFields.map(field => (
          <div key={field.key}>
            <label className="text-sm text-gray-600">{field.label}</label>
            <input
              type="text"
              placeholder={`Search by ${field.label.toLowerCase()}...`}
              className="w-full p-2 border rounded-lg mt-1"
              onChange={(e) => handleSearch(e.target.value, field.key)}
            />
          </div>
        ))}
      </div>
    </div>
  );

  // Enhanced filter panel
  const EnhancedFilterPanel = () => (
    <div className="bg-white rounded-lg border p-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Basic Filters */}
        <FilterSelect
          label="Semester"
          value={filters.semester}
          onChange={(e) => setFilters({...filters, semester: e.target.value})}
          options={[
            { value: 'spring2024', label: 'Spring 2024' },
            { value: 'fall2024', label: 'Fall 2024' },
          ]}
        />
  
        <FilterSelect
          label="Credits"
          value={filters.credits}
          onChange={(e) => setFilters({...filters, credits: e.target.value})}
          options={[
            { value: '1', label: '1 Credit' },
            { value: '3', label: '3 Credits' },
            { value: '6', label: '6 Credits (Lab)' },
          ]}
        />
  
        <FilterSelect
          label="Department"
          value={filters.department}
          onChange={(e) => setFilters({...filters, department: e.target.value})}
          options={[
            { value: 'cs', label: 'Computer Science' },
            { value: 'ai', label: 'Artificial Intelligence' },
          ]}
        />
  
        <FilterSelect
          label="Language"
          value={filters.language}
          onChange={(e) => setFilters({...filters, language: e.target.value})}
          options={[
            { value: 'english', label: 'English' },
            { value: 'korean', label: 'Korean' },
            { value: 'chinese', label: 'Chinese' },
          ]}
        />
  
        {/* Time and Schedule Filters */}
        <FilterSelect
          label="Day"
          value={filters.weekDay}
          onChange={(e) => setFilters({...filters, weekDay: e.target.value})}
          options={weekDays.map(day => ({ value: day.id, label: day.name }))}
        />
  
        <FilterSelect
          label="Period"
          value={filters.period}
          onChange={(e) => setFilters({...filters, period: e.target.value})}
          options={periods.map(period => ({ value: period.id, label: period.name }))}
        />
  
        {/* Academic and Course Type Filters */}
        <FilterSelect
          label="Academic Year"
          value={filters.academicYear}
          onChange={(e) => setFilters({...filters, academicYear: e.target.value})}
          options={[
            { value: '1', label: '1st Year' },
            { value: '2', label: '2nd Year' },
            { value: '3', label: '3rd Year' },
            { value: '4', label: '4th Year' },
          ]}
        />
  
        <FilterSelect
          label="Course Type"
          value={filters.classType}
          onChange={(e) => setFilters({...filters, classType: e.target.value})}
          options={[
            { value: 'regular', label: 'Regular' },
            { value: 'honors', label: 'Honors' },
            { value: 'cu', label: 'CU Class' },
            { value: 'international', label: 'International' },
          ]}
        />
  
        <FilterSelect
          label="Engineering Certification"
          value={filters.engineeringCert}
          onChange={(e) => setFilters({...filters, engineeringCert: e.target.value})}
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
        />

        <FilterSelect
        label="Engineering Certification"
        value={filters.engineeringCert}
        onChange={(e) => setFilters({...filters, engineeringCert: e.target.value})}
        options={[
            { value: 'yes', label: 'Required' },
            { value: 'no', label: 'Not Required' },
        ]}
        />

        <FilterSelect
        label="Course Type"
        value={filters.honors}
        onChange={(e) => setFilters({...filters, honors: e.target.value})}
        options={[
            { value: 'yes', label: 'Honors' },
            { value: 'no', label: 'Regular' },
        ]}
        />

        <FilterSelect
          label="Prerequisites"
          value={filters.requirements}
          onChange={(e) => setFilters({...filters, requirements: e.target.value})}
          options={[
            { value: 'none', label: 'No Prerequisites' },
            { value: 'required', label: 'Has Prerequisites' },
          ]}
        />
      </div>
    </div>
  );

  return (
    <div className="w-full h-full bg-white">
      <div className="p-6">
        {/* Header with Credits */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Available Courses</h1>
          <div className="text-sm text-blue-600">
            Total Credits: {totalCredits} / 21 (Minimum: 9)
          </div>
        </div>

        {/* Search Bar with Advanced Toggle */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={typeof searchTerm === 'string' ? searchTerm : ''}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setAdvancedSearch(!advancedSearch)}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            Advanced Search
          </button>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            Filters
          </button>
        </div>

        {/* Advanced Search Panel */}
        {advancedSearch && <AdvancedSearchPanel />}

        {/* Filter Panel */}
        {showFilters && <EnhancedFilterPanel />}

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.course_id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {course.course_name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {course.course_code} • {course.credits} Credits
                </p>

                <div className="space-y-2 mb-4">
                  <div className="grid grid-cols-[auto,1fr] gap-x-8">
                    <span className="text-gray-500">Professor:</span>
                    <span className="text-gray-900">{course.professor}</span>
                  </div>
                  <div className="grid grid-cols-[auto,1fr] gap-x-8">
                    <span className="text-gray-500">Schedule:</span>
                    <span className="text-gray-900">{course.schedule}</span>
                  </div>
                  <div className="grid grid-cols-[auto,1fr] gap-x-8">
                    <span className="text-gray-500">Location:</span>
                    <span className="text-gray-900">{course.location}</span>
                  </div>
                  <div className="grid grid-cols-[auto,1fr] gap-x-8">
                    <span className="text-gray-500">Capacity:</span>
                    <span className="text-gray-900">{course.capacity}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {course.english_class && (
                    <span className="px-3 py-1 text-sm rounded-full bg-blue-50 text-blue-600">
                      English
                    </span>
                  )}
                  <span className="px-3 py-1 text-sm rounded-full bg-purple-50 text-purple-600">
                    {course.semester}
                  </span>
                  <span className="px-3 py-1 text-sm rounded-full bg-green-50 text-green-600">
                    {course.department}
                  </span>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="w-full py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    See More
                  </button>
                  <button
                    onClick={() => onAddCourse(course)}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add My List
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Course Detail Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedCourse.course_name}</h2>
                    <p className="text-gray-600">
                      {selectedCourse.course_code} • {selectedCourse.credits} Credits
                    </p>
                  </div>
                  <button onClick={() => setSelectedCourse(null)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  <section>
                    <h3 className="font-semibold text-lg mb-2">Course Description</h3>
                    <p>{selectedCourse.description}</p>
                  </section>
                  

                  {selectedCourse.weeklySchedule && (
                    <section>
                      <h3 className="font-semibold text-lg mb-2">Weekly Schedule</h3>
                      <div className="space-y-2">
                        {selectedCourse.weeklySchedule.map((week) => (
                          <div key={week.week} className="border-b pb-2">
                            <div className="font-medium">Week {week.week}: {week.topic}</div>
                            {week.content && (
                              <div className="text-sm text-gray-600">{week.content}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}