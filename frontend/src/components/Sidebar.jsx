import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  User, 
  BookOpen, 
  Calendar, 
  MessageSquare,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'Profile', icon: User, path: '/profile' },
    { name: 'Courses', icon: BookOpen, path: '/courses' },
    { name: 'Schedule', icon: Calendar, path: '/schedule' },
    { name: 'Messages', icon: MessageSquare, path: '/messages' },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-indigo-800 text-white transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 bg-indigo-900">
            <h1 className="text-xl font-bold">Student Portal</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.path}
                className={`
                  flex items-center px-4 py-2 rounded-lg transition-colors
                  ${location.pathname === item.path 
                    ? 'bg-indigo-900 text-white' 
                    : 'text-indigo-100 hover:bg-indigo-700'}
                `}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </a>
            ))}
          </nav>

          {/* Logout button */}
          <div className="p-4">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-indigo-100 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 