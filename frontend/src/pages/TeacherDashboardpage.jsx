import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TopNavbar from "../components/Topnavbar";
import { gettingallTeachers } from "../features/Teacher";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiBookOpen, FiUsers, FiClipboard, FiCalendar, FiClock, FiPlusCircle, FiCheckCircle, FiActivity, FiStar } from "react-icons/fi";
import {
  fetchAllStudents
} from "../features/Student";
import {
  
  getAssignmentsByTeacherId
} from "../features/Assignment";
import { fetchAllTimetables } from "../features/TimeTable";

function TeacherDashboardpage() {
  const { Authuser } = useSelector((state) => state.auth);
  const teacheId = Authuser?.id || Authuser?._id || "";
  const { students } = useSelector((state) => state.Student);
  const { assignments,  isLoading } = useSelector((state) => state.Assignment);
  const dispatch = useDispatch();
  const { Timetables } = useSelector((state) => state.Timetables);
  const yourStudent = students?.filter(
    (item) => item?.classId?._id === Authuser?.classId
  );
  const teacherTimetable = Timetables?.filter(
    (time) => time?.teacherId?._id === Authuser?.id
  );
  console.log(Authuser?.classId);
  console.log(teacherTimetable);

  useEffect(() => {
      if (teacheId) {
        dispatch(getAssignmentsByTeacherId(teacheId));
      }
    }, [dispatch, teacheId]);
  useEffect(() => {
    dispatch(gettingallTeachers());
    dispatch(fetchAllStudents());
    dispatch(fetchAllTimetables());
  }, [dispatch]);
  const [stats, setStats] = useState({
    classes: 1,
    students: yourStudent.length,
    assignments: assignments.length,
    upcomingClasses: teacherTimetable?.length,
  });

  

  // Get upcoming events from timetable (next 3 days)
  const today = new Date();
  const threeDaysLater = new Date(today);
  threeDaysLater.setDate(today.getDate() + 3);

  const upcomingEvents =
    teacherTimetable?.filter((event) => {
        const eventDate = new Date(event.startTime);
        return eventDate >= today && eventDate <= threeDaysLater;
      })
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime)) || [];

  const firstThreeEvents = upcomingEvents.slice(0, 3);
  const moreEventsCount = upcomingEvents.length - firstThreeEvents.length;

  // Format date for timetable events
  console.log("Filtered upcoming events:", upcomingEvents);
  function formatEventDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  // Format date for timetable events
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "Not submitted";
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  };

  // Get current time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    // {yourStudent ? }
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
                  Welcome to your dashboard. Here's an overview of your classes
                  and assignments.
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
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
                  <p className="text-3xl font-bold">
                    {students?.filter(
                      (item) => item?.classId?._id === Authuser?.classId
                    ).length}
                  </p>
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
                  <p className="text-3xl font-bold">{stats.upcomingClasses}</p>
                </div>
              </div>
              <div className="bg-amber-50 p-2 rounded-lg mb-2">
                <p className="text-amber-700 text-sm font-medium">
                  Next:{" "}
                  {upcomingEvents[0]
                    ? formatEventDate(upcomingEvents[0].startTime)
                    : "No event"}
                </p>
                <p className="text-gray-800 font-medium truncate">
                  {`${upcomingEvents[0]?.subjectId?.SubjectName || ""} with ${
                    upcomingEvents[0]?.teacherId?.firstName || ""
                  }`}
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
                {Array.isArray(assignments) &&
                  assignments?.map((assignment) => {
                    return (
                      <div
                        key={assignment?._id}
                        className="py-4 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-start">
                          <div className="p-2 rounded-lg bg-purple-100 text-purple-700 mr-4">
                            <FiClipboard className="text-xl" />
                          </div>
                          <div className="flex-grow">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                              <h4 className="font-medium mb-1 sm:mb-0">
                                {assignment?.title}
                              </h4>
                              <span className="text-sm">
                                Due: {formatDateTime(assignment?.dueDate)}
                              </span>
                            </div>
                            <p className="text-sm mt-1">
                              {assignment?.ClassId?.ClassName}
                            </p>
                          </div>
                          <Link
                            to={`/teacher/TeachersAssignmentpage/${assignment?._id}`}
                            className="ml-4 text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Review
                          </Link>
                        </div>
                      </div>
                    );
                  })}
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
              {firstThreeEvents.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {firstThreeEvents.map((event, index) => (
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
                          <p className="font-medium text-black">
                            {`${event?.subjectId?.SubjectName} with Mrs. ${event?.teacherId?.firstName}`}
                          </p>
                          <p className="text-sm text-black">
                            {formatEventDate(event.startTime)}
                          </p>
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

                  {moreEventsCount > 0 && (
                    <p className="text-sm mt-3 text-gray-600">
                      +{moreEventsCount} more event
                      {moreEventsCount > 1 ? "s" : ""} scheduled soon
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-black">No upcoming events</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default TeacherDashboardpage;
