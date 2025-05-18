import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import TopNavbar from "../components/Topnavbar";
import { fetchAllStudents, calculateStudentStats } from "../features/Student";
import { fetchAllTimetables } from "../features/TimeTable";
import { fetchAllFees } from "../features/Fee";
import { fetchNotifications } from "../features/Notification";
import { motion } from "framer-motion";
import { 
  FiPlusCircle, 
  FiUser, 
  FiUsers, 
  FiDollarSign, 
  FiCalendar, 
  FiClock, 
  FiTrendingUp, 
  FiTarget, 
  FiActivity,
  FiPieChart,
  FiBarChart2,
  FiRefreshCw
} from "react-icons/fi";
import ProfilePicture from "../components/ProfilePicture";

function AdminDashboard() {
  const dispatch = useDispatch();
  const { students, studentStats } = useSelector((state) => state.Student);
  const { fees } = useSelector((state) => state.Fee);
  const { Timetables } = useSelector((state) => state.Timetable);
  const { Authuser } = useSelector((state) => state.auth);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showStatsDetails, setShowStatsDetails] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: { duration: 1, repeat: Infinity, repeatType: "reverse" }
    }
  };

  useEffect(() => {
    dispatch(fetchAllStudents());
    dispatch(fetchAllFees());
    dispatch(fetchAllTimetables());
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    if (students.length > 0) {
      dispatch(calculateStudentStats());
    }
  }, [students, dispatch]);

  // Calculate fees stats
  const totalFees = fees?.reduce((sum, fee) => sum + fee.amount, 0) || 0;
  const paidFees = fees?.filter(fee => fee.paidStatus).reduce((sum, fee) => sum + fee.amount, 0) || 0;
  const unpaidFees = totalFees - paidFees;
  const paidPercentage = totalFees > 0 ? Math.round((paidFees / totalFees) * 100) : 0;

  // Get upcoming events from timetable (next 3 days)
  const today = new Date();
  const threeDaysLater = new Date(today);
  threeDaysLater.setDate(today.getDate() + 3);
  
  const upcomingEvents = Timetables?.filter(event => {
    const eventDate = new Date(event.startTime);
    return eventDate >= today && eventDate <= threeDaysLater;
  }).sort((a, b) => new Date(a.startTime) - new Date(b.startTime)).slice(0, 5) || [];

  // Format date for timetable events
  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Get current time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Calculate days since last login
  const getLastLogin = () => {
    if (!Authuser?.lastLogin) return "First time login";
    const lastLogin = new Date(Authuser.lastLogin);
    const today = new Date();
    const diffTime = Math.abs(today - lastLogin);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? "Today" : diffDays === 1 ? "Yesterday" : `${diffDays} days ago`;
  };

  // Handle refresh data
  const handleRefreshData = () => {
    setIsRefreshing(true);
    Promise.all([
      dispatch(fetchAllStudents()),
      dispatch(fetchAllFees()),
      dispatch(fetchAllTimetables())
    ]).finally(() => {
      setTimeout(() => setIsRefreshing(false), 1000);
    });
  };
  console.log("test")

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <TopNavbar />
      
      <motion.div 
        className="p-3 md:p-5 lg:p-6 mt-14"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Message */}
        <motion.div 
          className="mb-4 md:mb-6 overflow-hidden rounded-xl shadow-lg"
          variants={itemVariants}
        >
          <div className="relative bg-gradient-to-r from-indigo-600 via-blue-700 to-purple-700 p-3 sm:p-4 md:p-6">
            <div className="absolute top-0 right-0 w-full h-full opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,0 L100,0 L100,100 Z" fill="white"/>
              </svg>
            </div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="mb-3 md:mb-0">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-1">{getGreeting()}, {Authuser?.firstName || 'Admin'}</h2>
                <p className="text-sm">Welcome to your dashboard. Here's an overview of your school.</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 sm:p-3 w-full md:w-auto">
                <p className="font-medium text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <div className="mt-1 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></span>
                  <p className="text-xs text-sm">Last login: {getLastLogin()}</p>
                </div>
              </div>
            </div>
            <div className="relative z-10 mt-3">
              <button 
                onClick={handleRefreshData}
                className="flex items-center bg-gray-200 text-black px-3 py-1.5 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                disabled={isRefreshing}
              >
                <FiRefreshCw className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {/* Student Stats */}
          <motion.div 
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
            variants={itemVariants}
            whileHover={{ y: -5 }}
            onClick={() => setShowStatsDetails(!showStatsDetails)}
          >
            <div className="p-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-blue-100 mr-4">
                  <FiUsers className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm font-medium text-black">Total Students</p>
                  <p className="text-3xl font-bold text-black">{studentStats.total || 0}</p>
                </div>
              </div>

              <motion.div 
                animate={showStatsDetails ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                initial={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-4"
              >
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium mb-2 text-black">Student Distribution</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm text-black">
                        <span>Active</span>
                        <span>{studentStats.active || 0} ({studentStats.total ? Math.round((studentStats.active / studentStats.total) * 100) : 0}%)</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full mt-1">
                        <div 
                          className="h-full bg-green-500 rounded-full" 
                          style={{ width: `${studentStats.total ? (studentStats.active / studentStats.total) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-black">
                        <span>Suspended</span>
                        <span>{studentStats.suspended || 0} ({studentStats.total ? Math.round((studentStats.suspended / studentStats.total) * 100) : 0}%)</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full mt-1">
                        <div 
                          className="h-full bg-red-500 rounded-full" 
                          style={{ width: `${studentStats.total ? (studentStats.suspended / studentStats.total) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-black">
                        <span>Graduated</span>
                        <span>{studentStats.graduated || 0} ({studentStats.total ? Math.round((studentStats.graduated / studentStats.total) * 100) : 0}%)</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full mt-1">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: `${studentStats.total ? (studentStats.graduated / studentStats.total) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <div className="flex justify-between mt-4 bg-gray-50 -mx-6 px-6 py-3 border-t">
                <div>
                  <span className="font-semibold">{studentStats.active || 0}</span>
                  <span className="text-sm ml-1">Active</span>
                </div>
                <div>
                  <span className="font-semibold">{studentStats.suspended || 0}</span>
                  <span className="text-sm ml-1">Suspended</span>
                </div>
                <div>
                  <span className="font-semibold">{studentStats.graduated || 0}</span>
                  <span className="text-sm ml-1">Graduated</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Fee Stats */}
          <motion.div 
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="p-1 bg-gradient-to-r from-green-500 to-emerald-600"></div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-green-100 mr-4">
                  <FiDollarSign className="text-green-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm font-medium text-black">Total Fees</p>
                  <p className="text-3xl font-bold text-black">${totalFees.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              </div>
              
              <div className="mt-4 mb-2">
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Payment Progress</span>
                  <span className="font-medium">{paidPercentage}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full" 
                    initial={{ width: 0 }}
                    animate={{ width: `${paidPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  ></motion.div>
                </div>
              </div>
              
              <div className="flex justify-between bg-gray-50 -mx-6 px-6 py-3 border-t">
                <div>
                  <span className="font-semibold">${paidFees.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <p className="text-sm">Paid</p>
                </div>
                <div className="text-right">
                  <span className="font-semibold">${unpaidFees.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <p className="text-sm">Unpaid</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Classes/Timetable Overview */}
          <motion.div 
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="p-1 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-purple-100 mr-4">
                  <FiCalendar className="text-purple-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm font-medium text-black">Scheduled Events</p>
                  <div className="flex items-baseline">
                    <p className="text-3xl font-bold text-black">{Timetables?.length || 0}</p>
                    <p className="text-sm ml-1">total</p>
                  </div>
                </div>
              </div>
              
              {upcomingEvents.length > 0 ? (
                <div className="mt-4">
                  <motion.div 
                    className="bg-purple-50 p-2 rounded-lg mb-2"
                    variants={pulseVariants}
                    animate="pulse"
                  >
                    <p className="text-sm font-medium text-black">
                      Next: {formatEventDate(upcomingEvents[0].startTime)}
                    </p>
                    <p className="font-medium truncate text-black">{upcomingEvents[0].title}</p>
                  </motion.div>
                  {upcomingEvents.length > 1 && (
                    <p className="text-sm mt-1">
                      +{upcomingEvents.length - 1} more events scheduled soon
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-4 bg-gray-50 p-2 rounded-lg">
                  <p className="text-sm text-black">No upcoming events</p>
                </div>
              )}
              
              <div className="flex justify-center bg-gray-50 -mx-6 px-6 py-3 border-t mt-3">
                <Link to="/Admin/Timetable" className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center transition-colors">
                  <FiClock className="mr-1" /> View Full Schedule
                </Link>
              </div>
            </div>
          </motion.div>
          
          {/* Quick Actions */}
          <motion.div 
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="p-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-amber-100 mr-4">
                  <FiTarget className="text-amber-600 text-xl" />
                </div>
                <h3 className="font-semibold text-black">Quick Actions</h3>
              </div>
              
              <div className="space-y-3">
                <Link to="/Admin/students" className="flex items-center p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                    <FiUser className="text-blue-600" />
                  </div>
                  <span className="text-black">Add New Student</span>
                </Link>
                
                <Link to="/Admin/AdminTeacher" className="flex items-center p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 group-hover:bg-green-200 transition-colors">
                    <FiUsers className="text-green-600" />
                  </div>
                  <span className="text-black">Manage Teachers</span>
                </Link>
                
                <Link to="/Admin/Timetable" className="flex items-center p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 group-hover:bg-purple-200 transition-colors">
                    <FiCalendar className="text-purple-600" />
                  </div>
                  <span className="text-black">Schedule Classes</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Students */}
          <motion.div 
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden lg:col-span-2"
            variants={itemVariants}
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg flex items-center">
                  <FiUsers className="mr-2 text-blue-600" /> Recent Students
                </h3>
                <Link to="/Admin/students" className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium">
                  View All <FiPlusCircle className="ml-1" />
                </Link>
              </div>
            </div>
            
            <div className="p-6">
              {students.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {students.slice(0, 5).map((student, index) => (
                    <motion.div 
                      key={student._id} 
                      className="flex items-center py-4 first:pt-0 last:pb-0"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.6)" }}
                      
                    >
                      <div className="mr-4 flex-shrink-0 w-12 h-12 border-2 border-gray-200 rounded-full overflow-hidden">
                        <ProfilePicture
                          profilePic={student.profileImage}
                          firstName={student.firstName}
                          size="small"
                          editable={false}
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium text-black">
                          {student.firstName} {student.lastName}
                        </h4>
                        <div className="flex items-center gap-4">
                          <p className="text-sm text-black">{student.email}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            student.status === 'active' ? 'bg-green-100' :
                            student.status === 'suspended' ? 'bg-red-100' :
                            'bg-blue-100'
                          }`}>
                            {student.status || 'Active'}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {/* Details button removed as requested */}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-black mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <p className="text-black">No students found</p>
                  <Link to="/Admin/students" className="mt-2 inline-block text-blue-600 hover:text-blue-800">
                    Add Students
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Upcoming Events/Timetable */}
          <motion.div 
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
            variants={itemVariants}
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg flex items-center">
                  <FiCalendar className="mr-2 text-purple-600" /> Upcoming Events
                </h3>
                <Link to="/Admin/Timetable" className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium">
                  View Calendar <FiCalendar className="ml-1" />
                </Link>
              </div>
            </div>
            
            <div className="p-6">
              {upcomingEvents.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {upcomingEvents.map((event, index) => (
                    <motion.div 
                      key={event._id} 
                      className="py-4 first:pt-0 last:pb-0"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 3 }}
                    >
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <FiClock className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-black">{event.title}</p>
                          <p className="text-sm text-black">{formatEventDate(event.startTime)}</p>
                        </div>
                      </div>
                      {event.description && (
                        <p className="text-sm ml-13 pl-10">
                          {event.description.length > 100 
                            ? `${event.description.substring(0, 100)}...` 
                            : event.description}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-black mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-black">No upcoming events</p>
                  <Link to="/Admin/Timetable" className="mt-2 inline-block text-blue-600 hover:text-blue-800">
                    Schedule Events
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminDashboard;