import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import TopNavbar from '../components/Topnavbar';
import { FiHome, FiBook, FiClipboard, FiCalendar, FiUser, FiSettings, FiBell, FiLogOut } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { logout } from "../features/Authentication";
import toast from 'react-hot-toast';

function StudentLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { Authuser } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success('Logged out successfully');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 200);
    } catch (error) {
      toast.error('Logout failed');
      console.error('Logout error:', error);
    }
  };

  const navigation = [
    { name: 'Dashboard', icon: FiHome, path: '/student/dashboard' },
    { name: 'Courses', icon: FiBook, path: '/student/courses' },
    { name: 'Assignments', icon: FiClipboard, path: '/student/assignments' },
    { name: 'Timetable', icon: FiCalendar, path: '/student/timetable' },
    { name: 'Grades', icon: FiClipboard, path: '/student/grades' },
  ];

  const userNavigation = [
    { name: 'Account', icon: FiUser, path: '/student/account' },
    { name: 'Settings', icon: FiSettings, path: '/student/settings' },
    { name: 'Notifications', icon: FiBell, path: '/student/notifications' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />
      
      <div className="flex">
        {/* Sidebar - Updated to be fixed and shorter */}
        <div className="hidden md:block fixed h-[calc(100vh-3.5rem)] top-14 left-0 z-10">
          <div className="flex flex-col w-64 h-full">
            <div className="flex flex-col h-full bg-gradient-to-b from-blue-950 via-blue-900 to-gray-900 text-white shadow-xl">
              <div className="flex items-center flex-shrink-0 px-4 py-3">
                <h2 className="text-lg font-semibold text-white">Student Portal</h2>
              </div>
              
              {/* User Profile Section - Made more compact */}
              <div className="flex items-center px-4 py-2 border-b border-blue-700/30">
                <div className="w-7 h-7 rounded-full overflow-hidden mr-2 border-2 border-blue-400">
                  {Authuser?.ProfilePic ? (
                    <img 
                      src={Authuser.ProfilePic} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-bold text-xs">
                        {Authuser?.firstName?.charAt(0) || 'A'}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-white text-xs">
                    {`${Authuser?.firstName || ''} ${Authuser?.lastName || ''}`}
                  </p>
                  <p className="text-[10px] text-blue-300 capitalize">
                    {Authuser?.role || 'Student'}
                  </p>
                </div>
              </div>

              {/* Navigation - Made more compact */}
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-transparent">
                <nav className="py-2 px-2 space-y-0.5">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <motion.button
                        key={item.name}
                        onClick={() => navigate(item.path)}
                        className="group flex items-center px-2 py-1.5 text-sm font-medium rounded-md text-gray-200 hover:bg-blue-800/30 hover:text-white w-full transition-colors duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon className="mr-2 h-5 w-5" />
                        <span className="text-xs">{item.name}</span>
                      </motion.button>
                    );
                  })}
                </nav>

                {/* User Navigation - Made more compact */}
                <div className="mt-2 px-2 space-y-0.5">
                  {userNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <motion.button
                        key={item.name}
                        onClick={() => navigate(item.path)}
                        className="group flex items-center px-2 py-1.5 text-sm font-medium rounded-md text-gray-200 hover:bg-blue-800/30 hover:text-white w-full transition-colors duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon className="mr-2 h-5 w-5" />
                        <span className="text-xs">{item.name}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Logout Button - Made more compact */}
              <div className="border-t border-blue-700/30 px-2 py-2">
                <motion.button
                  onClick={handleLogout}
                  className="flex items-center w-full px-2 py-1.5 text-sm font-medium rounded-md text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiLogOut className="mr-2 h-5 w-5" />
                  <span className="text-xs">Logout</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content - Updated to account for fixed sidebar */}
        <div className="flex-1 md:ml-64">
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default StudentLayout; 