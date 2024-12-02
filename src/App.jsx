import { useState } from 'react';
import { Menu, MessageCircle, Calendar, BookOpen, List, LogIn, UserPlus } from 'lucide-react';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import CourseList from './pages/CourseList';
import MyList from './pages/MyList';
import ChatInterface from './pages/ChatInterface';
import Schedule from './pages/Schedule';
import ApiTest from './components/ApiTest';


export default function App() {
  const [currentPage, setCurrentPage] = useState('courses');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [savedCourses, setSavedCourses] = useState([]);

  const handleAddCourse = (course) => {
    // Check if course is already in the list
    if (!savedCourses.some(saved => saved.course_id === course.course_id)) {
      setSavedCourses(prev => [...prev, course]);
      alert('Course added to My List!');
    } else {
      alert('This course is already in your list!');
    }
  };

  const handleRemoveCourse = (courseId) => {
    setSavedCourses(prev => prev.filter(course => course.course_id !== courseId));
  };

  const navItems = [
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'schedule', icon: Calendar, label: 'Schedule' },
    { id: 'courses', icon: BookOpen, label: 'Course List' },
    { id: 'mylist', icon: List, label: 'My List' },
    { id: 'signin', icon: LogIn, label: 'Sign In' },
    { id: 'signup', icon: UserPlus, label: 'Sign Up' },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'signin':
        return <SignIn />;
      case 'signup':
        return <SignUp />;
      case 'mylist':
        return <MyList savedCourses={savedCourses} onRemoveCourse={handleRemoveCourse} />;
      case 'schedule':
        return <Schedule savedCourses={savedCourses} />;
      case 'courses':
        return <CourseList onAddCourse={handleAddCourse} savedCourses={savedCourses} />;
      case 'chat':
        return <ChatInterface />;
      default:
        return <div>Welcome to the Home Page</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-64' : 'w-16'
        } bg-white border-r transition-all duration-300 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b flex items-center justify-between">
          {isSidebarOpen && <span className="font-semibold">Course Manager</span>}
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center space-x-2 p-2 rounded-lg mb-1 
                ${currentPage === item.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}
                ${!isSidebarOpen && 'justify-center'}`}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <ApiTest />
        {renderPage()}
      </div>
    </div>
  );
}