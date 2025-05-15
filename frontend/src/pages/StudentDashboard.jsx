import React, { useEffect, useState } from "react";
import TopNavbar from "../components/Topnavbar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiBookOpen, FiClipboard, FiCalendar, FiClock, FiBarChart2, FiAward, FiFileText, FiCheckSquare } from "react-icons/fi";

function StudentDashboard() {
  const { Authuser } = useSelector((state) => state.auth);
  
  // Mock data - would be replaced with actual data from API
  const [stats, setStats] = useState({
    courses: 6,
    assignments: 9,
    completedAssignments: 5,
    averageGrade: 87.5
  });
  
  const [courseProgress] = useState([
    { id: 1, name: "Mathematics", progress: 75, grade: "A-" },
    { id: 2, name: "Science", progress: 82, grade: "B+" },
    { id: 3, name: "History", progress: 69, grade: "B" },
    { id: 4, name: "English Literature", progress: 92, grade: "A" }
  ]);
  
  const [upcomingAssignments] = useState([
    {
      id: 1,
      title: "Algebra Homework Set 4",
      course: "Mathematics",
      dueDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
      status: "not-started"
    },
    {
      id: 2,
      title: "Chemical Reactions Lab Report",
      course: "Science",
      dueDate: new Date(Date.now() + 86400000 * 4), // 4 days from now
      status: "in-progress"
    },
    {
      id: 3,
      title: "Essay on American Revolution",
      course: "History",
      dueDate: new Date(Date.now() + 86400000 * 6), // 6 days from now
      status: "not-started"
    }
  ]);
  
  const [upcomingClasses] = useState([
    {
      id: 1,
      title: "Mathematics - Algebra",
      time: new Date(Date.now() + 3600000 * 3), // 3 hours from now
      room: "Room 101",
      teacher: "Mr. Johnson"
    },
    {
      id: 2,
      title: "Science - Chemistry",
      time: new Date(Date.now() + 3600000 * 5), // 5 hours from now
      room: "Science Lab",
      teacher: "Ms. Rodriguez"
    },
    {
      id: 3,
      title: "English Literature",
      time: new Date(Date.now() + 3600000 * 24), // 24 hours from now
      room: "Room 203",
      teacher: "Mrs. Thompson"
    }
  ]);
  
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
  
  // Format date helper function
  const formatDateTime = (date) => {
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  // Get days remaining helper function
  const getDaysRemaining = (dueDate) => {
    const now = new Date();
    const diffTime = dueDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    return `Due in ${diffDays} days`;
  };
  
  // Get current time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <TopNavbar />
      
      <motion.div 
        className="p-6 md:p-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Message */}
        <motion.div 
          className="mb-8 overflow-hidden rounded-2xl shadow-lg"
          variants={itemVariants}
        >
          <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 md:p-8">
            <div className="absolute top-0 right-0 w-full h-full opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,0 L100,0 L100,100 Z" fill="white"/>
              </svg>
            </div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="mb-4 md:mb-0">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{getGreeting()}, {Authuser?.firstName || 'Student'}</h2>
                <p className="text-blue-700">Welcome to your dashboard. Here's an overview of your courses and assignments.</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 w-full md:w-auto">
                <p className="font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <div className="mt-2 flex items-center">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  <p className="text-sm">Next Class: {upcomingClasses[0]?.title || 'None Today'}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Courses Stats */}
          <motion.div 
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
            variants={itemVariants}
          >
            <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-blue-100 mr-4">
                  <FiBookOpen className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="text-black text-sm font-medium">Enrolled Courses</p>
                  <p className="text-3xl font-bold text-black">{stats.courses}</p>
                </div>
              </div>
              <div className="bg-gray-50 -mx-6 px-6 py-3 border-t">
                <Link to="/student/courses" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center">
                  View Courses <FiBarChart2 className="ml-1" />
                </Link>
              </div>
            </div>
          </motion.div>
          
          {/* Assignments Stats */}
          <motion.div 
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
            variants={itemVariants}
          >
            <div className="p-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-indigo-100 mr-4">
                  <FiClipboard className="text-indigo-600 text-xl" />
                </div>
                <div>
                  <p className="text-black text-sm font-medium">Assignments</p>
                  <p className="text-3xl font-bold text-black">{stats.assignments}</p>
                </div>
              </div>
              <div className="mt-2 mb-2">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-black">Completion</span>
                  <span className="text-sm font-medium text-black">
                    {Math.round((stats.completedAssignments / stats.assignments) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" 
                    style={{ width: `${(stats.completedAssignments / stats.assignments) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between items-center bg-gray-50 -mx-6 px-6 py-3 border-t">
                <div>
                  <span className="text-purple-600 font-semibold">{stats.completedAssignments}</span>
                  <span className="text-gray-500 text-sm ml-1">Completed</span>
                </div>
                <div>
                  <span className="text-red-500 font-semibold">{stats.assignments - stats.completedAssignments}</span>
                  <span className="text-gray-500 text-sm ml-1">Pending</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Grade Average */}
          <motion.div 
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
            variants={itemVariants}
          >
            <div className="p-1 bg-gradient-to-r from-green-500 to-emerald-600"></div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-green-100 mr-4">
                  <FiAward className="text-green-600 text-xl" />
                </div>
                <div>
                  <p className="text-black text-sm font-medium">Average Grade</p>
                  <p className="text-3xl font-bold text-black">{stats.averageGrade}%</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-1">
                    <span className="text-blue-700 font-medium">A</span>
                  </div>
                  <span className="text-xs text-black">2 Courses</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-1">
                    <span className="text-green-700 font-medium">B</span>
                  </div>
                  <span className="text-xs text-black">3 Courses</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mb-1">
                    <span className="text-yellow-700 font-medium">C</span>
                  </div>
                  <span className="text-xs text-black">1 Course</span>
                </div>
              </div>
              
              <div className="bg-gray-50 -mx-6 px-6 py-3 border-t">
                <Link to="/student/grades" className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center justify-center">
                  View Full Report <FiFileText className="ml-1" />
                </Link>
              </div>
            </div>
          </motion.div>
          
          {/* Schedule Overview */}
          <motion.div 
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
            variants={itemVariants}
          >
            <div className="p-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-amber-100 mr-4">
                  <FiCalendar className="text-amber-600 text-xl" />
                </div>
                <div>
                  <p className="text-black text-sm font-medium">Today's Classes</p>
                  <p className="text-3xl font-bold text-black">{upcomingClasses.length}</p>
                </div>
              </div>
              
              <div className="bg-amber-50 p-2 rounded-lg mb-2">
                <p className="text-black text-sm font-medium">Next: {formatDateTime(upcomingClasses[0].time)}</p>
                <p className="text-black font-medium truncate">{upcomingClasses[0].title}</p>
                <p className="text-xs text-black mt-0.5">{upcomingClasses[0].room} • {upcomingClasses[0].teacher}</p>
              </div>
              
              <div className="flex justify-center bg-gray-50 -mx-6 px-6 py-3 border-t mt-3">
                <Link to="/student/timetable" className="text-amber-600 hover:text-amber-800 text-sm font-medium flex items-center">
                  <FiClock className="mr-1" /> View Schedule
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Progress */}
          <motion.div 
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden lg:col-span-2"
            variants={itemVariants}
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg text-black">Course Progress</h3>
                <Link to="/student/courses" className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium">
                  View All Courses <FiBarChart2 className="ml-1" />
                </Link>
              </div>
            </div>
            
            <div className="p-6">
              <div className="divide-y divide-gray-100">
                {courseProgress.map((course) => (
                  <div key={course.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-black">{course.name}</h4>
                        <p className="text-sm text-black">Current Grade: <span className="font-medium text-blue-600">{course.grade}</span></p>
                      </div>
                      <div className="text-right">
                        <span className="font-medium text-black">{course.progress}%</span>
                        <p className="text-sm text-black">Completed</p>
                      </div>
                    </div>
                    <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          course.progress >= 80 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                            : course.progress >= 60
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                              : 'bg-gradient-to-r from-yellow-500 to-amber-500'
                        }`}
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Upcoming Assignments */}
          <motion.div 
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
            variants={itemVariants}
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg text-black">Upcoming Assignments</h3>
                <Link to="/student/assignments" className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium">
                  All Assignments
                </Link>
              </div>
            </div>
            
            <div className="p-6">
              <div className="divide-y divide-gray-100">
                {upcomingAssignments.map((assignment) => (
                  <div key={assignment.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-start">
                      <div className={`p-2 rounded-lg mr-4 ${
                        assignment.status === 'complete' ? 'bg-green-100 text-green-700' :
                        assignment.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {assignment.status === 'complete' ? 
                          <FiCheckSquare className="text-xl" /> : 
                          <FiClipboard className="text-xl" />
                        }
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium text-black">{assignment.title}</h4>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                          <p className="text-sm text-black">{assignment.course}</p>
                          <span className={`text-xs mt-1 sm:mt-0 py-1 px-2 rounded-full ${
                            getDaysRemaining(assignment.dueDate).includes('today') ? 
                              'bg-red-100 text-red-700' : 
                              getDaysRemaining(assignment.dueDate).includes('tomorrow') ?
                                'bg-amber-100 text-amber-700' :
                                'bg-blue-100 text-blue-700'
                          }`}>
                            {getDaysRemaining(assignment.dueDate)}
                          </span>
                        </div>
                        <div className="mt-2 flex space-x-2">
                          <Link to={`/student/assignments/${assignment.id}`} className="text-xs text-blue-600 hover:text-blue-800">
                            View Details
                          </Link>
                          {assignment.status !== 'complete' && (
                            <Link to={`/student/assignments/${assignment.id}/submit`} className="text-xs text-green-600 hover:text-green-800">
                              {assignment.status === 'in-progress' ? 'Continue' : 'Start Assignment'}
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default StudentDashboard; 