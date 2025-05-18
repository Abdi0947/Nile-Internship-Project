import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TopNavbar from "../components/Topnavbar";
import { gettingallTeachers } from "../features/Teacher";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiBookOpen, FiUsers, FiClipboard, FiCalendar, FiClock, FiPlusCircle, FiCheckCircle, FiActivity, FiStar } from "react-icons/fi";

function TeacherDashboardpage() {
  const { Authuser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { getallTeachers } = useSelector((state) => state.Teacher);
  // console.log(Authuser);
  const isUserTeacher = getallTeachers?.some((item) => item.email === Authuser.email);
  console.log(getallTeachers);
  // Mock data - would be replaced with actual data from the backend

  useEffect(() => {
      dispatch(gettingallTeachers());
    }, [dispatch]);
  const [stats, setStats] = useState({
    classes: 4,
    students: 120,
    assignments: 8,
    upcomingClasses: 3
  });
  
  const [recentAssignments] = useState([
    {
      id: 1,
      title: "Math Homework - Algebra",
      dueDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
      submissionsCount: 18,
      totalStudents: 30,
      class: "Grade 10 - Math"
    },
    {
      id: 2,
      title: "Science Project - Photosynthesis",
      dueDate: new Date(Date.now() + 86400000 * 5), // 5 days from now
      submissionsCount: 12,
      totalStudents: 28,
      class: "Grade 10 - Science"
    },
    {
      id: 3,
      title: "History Essay - Industrial Revolution",
      dueDate: new Date(Date.now() + 86400000 * 7), // 7 days from now
      submissionsCount: 5,
      totalStudents: 25,
      class: "Grade 10 - History"
    }
  ]);
  
  const [upcomingClasses] = useState([
    {
      id: 1,
      title: "Math - Advanced Algebra",
      time: new Date(Date.now() + 3600000 * 2), // 2 hours from now
      room: "Room 101",
      students: 30
    },
    {
      id: 2,
      title: "Science Lab - Chemical Reactions",
      time: new Date(Date.now() + 3600000 * 5), // 5 hours from now
      room: "Science Lab",
      students: 28
    },
    {
      id: 3,
      title: "History - World War II",
      time: new Date(Date.now() + 3600000 * 24), // 24 hours from now
      room: "Room 203",
      students: 25
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
  
  // Format date for timetable events
  const formatDateTime = (date) => {
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
  
  return (
    // {isUserTeacher ? }
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <TopNavbar />
      {isUserTeacher ? (
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
            <div className="relative bg-gradient-to-r from-blue-700 via-teal-600 to-teal-700 p-6 md:p-8">
              <div className="absolute top-0 right-0 w-full h-full opacity-10">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <path d="M0,0 L100,0 L100,100 Z" fill="white" />
                </svg>
              </div>
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-3xl md:text-4xl font-bold text-black mb-2">
                    {getGreeting()}, {Authuser?.firstName || "Teacher"}
                  </h2>
                  <p>
                    Welcome to your dashboard. Here's an overview of your
                    classes and assignments.
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 w-full md:w-auto">
                  <p className="font-medium">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <div className="mt-2 flex items-center">
                    <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    <p className="text-sm">
                      Next Class: {upcomingClasses[0]?.title || "None Today"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {/* Classes Stats */}
            <motion.div
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
              variants={itemVariants}
            >
              <div className="p-1 bg-gradient-to-r from-blue-500 to-teal-500"></div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-blue-100 mr-4">
                    <FiBookOpen className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">My Classes</p>
                    <p className="text-3xl font-bold">{stats.classes}</p>
                  </div>
                </div>
                <div className="bg-gray-50 -mx-6 px-6 py-3 border-t">
                  <Link
                    to="/teacher/TeacherSubject"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center"
                  >
                    View All Classes <FiPlusCircle className="ml-1" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Students Stats */}
            <motion.div
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
              variants={itemVariants}
            >
              <div className="p-1 bg-gradient-to-r from-teal-500 to-cyan-600"></div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-teal-100 mr-4">
                    <FiUsers className="text-teal-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Total Students</p>
                    <p className="text-3xl font-bold">{stats.students}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center bg-gray-50 -mx-6 px-6 py-3 border-t">
                  <div>
                    <span className="text-font-semibold text-sm">
                      Avg. Attendance
                    </span>
                    <div className="flex items-center mt-1">
                      <div className="w-24 h-1.5 bg-gray-200 rounded-full mr-2">
                        <div
                          className="h-full bg-teal-500 rounded-full"
                          style={{ width: "92%" }}
                        ></div>
                      </div>
                      <span className="text-sm">92%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Assignments Stats */}
            <motion.div
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
              variants={itemVariants}
            >
              <div className="p-1 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-purple-100 mr-4">
                    <FiClipboard className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Active Assignments</p>
                    <p className="text-3xl font-bold">{stats.assignments}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-gray-50 -mx-6 px-6 py-3 border-t">
                  <div>
                    <span className="text-font-semibold">64%</span>
                    <span className="text-sm ml-1">Submitted</span>
                  </div>
                  <Link
                    to="/teacher/TeachersAssignmentpage"
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                  >
                    Manage
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
                    <p className="text-sm font-medium">Upcoming Classes</p>
                    <p className="text-3xl font-bold">
                      {stats.upcomingClasses}
                    </p>
                  </div>
                </div>
                <div className="bg-amber-50 p-2 rounded-lg mb-2">
                  <p className="text-amber-700 text-sm font-medium">
                    Next: {formatDateTime(upcomingClasses[0].time)}
                  </p>
                  <p className="text-gray-800 font-medium truncate">
                    {upcomingClasses[0].title}
                  </p>
                </div>
                <div className="flex justify-center bg-gray-50 -mx-6 px-6 py-3 border-t mt-3">
                  <Link
                    to="/teacher/timetable"
                    className="text-amber-600 hover:text-amber-800 text-sm font-medium flex items-center"
                  >
                    <FiClock className="mr-1" /> View Schedule
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Review Card */}
            <motion.div
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
              variants={itemVariants}
            >
              <div className="p-1 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
              <div className="p-6 flex flex-col items-center justify-center">
                <div className="p-3 rounded-full bg-yellow-100 mb-4">
                  <FiStar className="text-yellow-600 text-2xl" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Review</h3>
                <p className="text-sm text-gray-600 mb-4 text-center">
                  View and analyze your teaching performance, feedback, and
                  class stats.
                </p>
                <Link
                  to="/teacher/review"
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium"
                >
                  Go to Review
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Assignments */}
            <motion.div
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden lg:col-span-2"
              variants={itemVariants}
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Recent Assignments</h3>
                  <Link
                    to="/teacher/TeachersAssignmentpage"
                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
                  >
                    View All <FiPlusCircle className="ml-1" />
                  </Link>
                </div>
              </div>

              <div className="p-6">
                <div className="divide-y divide-gray-100">
                  {recentAssignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="py-4 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-start">
                        <div className="p-2 rounded-lg bg-purple-100 text-purple-700 mr-4">
                          <FiClipboard className="text-xl" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                            <h4 className="font-medium mb-1 sm:mb-0">
                              {assignment.title}
                            </h4>
                            <span className="text-sm">
                              Due:{" "}
                              {assignment.dueDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{assignment.class}</p>
                          <div className="mt-2">
                            <div className="flex justify-between mb-1">
                              <span className="text-xs">Submissions</span>
                              <span className="text-xs">
                                {assignment.submissionsCount}/
                                {assignment.totalStudents}
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500 rounded-full"
                                style={{
                                  width: `${
                                    (assignment.submissionsCount /
                                      assignment.totalStudents) *
                                    100
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <Link
                          to={`/teacher/TeachersAssignmentpage/${assignment.id}`}
                          className="ml-4 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Review
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Upcoming Classes */}
            <motion.div
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
              variants={itemVariants}
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Upcoming Classes</h3>
                  <Link
                    to="/teacher/timetable"
                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
                  >
                    Full Schedule <FiCalendar className="ml-1" />
                  </Link>
                </div>
              </div>

              <div className="p-6">
                <div className="divide-y divide-gray-100">
                  {upcomingClasses.map((cls) => (
                    <div key={cls.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <FiClock className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{cls.title}</p>
                          <p className="text-sm">{formatDateTime(cls.time)}</p>
                        </div>
                      </div>
                      <div className="ml-13 pl-10">
                        <div className="flex justify-between items-center">
                          <div className="text-sm">
                            <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded-md mr-2">
                              {cls.room}
                            </span>
                            <span className="inline-block px-2 py-1 bg-teal-50 text-teal-700 rounded-md">
                              <FiUsers className="inline mr-1 text-xs" />{" "}
                              {cls.students} students
                            </span>
                          </div>
                          <Link
                            to={`/teacher/TeacherSubject/${cls.id}`}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <p>Hi teacher {Authuser?.firstName}</p>
            <p>Please Wait until adimn approve You!</p>
            <p>It may take sometime you can came back later!</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherDashboardpage;
