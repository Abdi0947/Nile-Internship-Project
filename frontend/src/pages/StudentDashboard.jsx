import React, { useEffect, useState } from "react";
import TopNavbar from "../components/Topnavbar";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiBookOpen, FiClipboard, FiCalendar, FiClock, FiBarChart2, FiAward, FiFileText, FiCheckSquare, FiUpload } from "react-icons/fi";
import { getGradeById } from "../features/Grade";
import {getAllClasses} from '../features/Class.js'
import { getAllAssignments } from "../features/Assignment";
import { fetchAllTimetables } from "../features/TimeTable";

function StudentDashboard() {
  const dispatch = useDispatch();
  const { Authuser } = useSelector((state) => state.auth);
  const {  grades } = useSelector((state) => state.Grade);
  const id = Authuser?.classId || "";
  const studentId = Authuser?.id;
  const { classes } = useSelector((state) => state.Class);
  const { assignments, isLoading } = useSelector((state) => state.Assignment);

  useEffect(()=> {
    dispatch(getAllClasses())
    dispatch(getAllAssignments())
    dispatch(fetchAllTimetables());
  }, [dispatch])

  const [stats, setStats] = useState({
    completedAssignments: 5,
    averageGrade: 87.5,
  });
  
  useEffect(() => {
        dispatch(getGradeById(studentId));
      }, [dispatch]);
    
    let totalSum = 0;
    let subjectCount = 0;
  
    grades.forEach((sub) => {
      if(sub?.assignment && sub?.midterm && sub?.final) {
        const sum = sub?.assignment + sub?.midterm + sub?.final;
        totalSum += sum;
        subjectCount++;
      } else {
        return totalSum = 0; // If any score is missing, we consider it as 0 for average calculation
      }
      
    });
    
  
    const overallAverage = totalSum / subjectCount;
  
  
  
  
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
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  {getGreeting()}, {Authuser?.firstName || "Student"}
                </h2>
                <p className="text-blue-700">
                  Welcome to your dashboard. Here's an overview of your courses
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
                  <p className="text-black text-sm font-medium">
                    Enrolled Courses
                  </p>
                  <p className="text-3xl font-bold text-black">
                    {classes?.find((item) => item?._id === Authuser?.classId)
                      ?.subject?.length || 0}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 -mx-6 px-6 py-3 border-t">
                <Link
                  to="/student/courses"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center"
                >
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
                  <p className="text-3xl font-bold text-black">
                    {assignments?.assignment?.length || 0}
                  </p>
                </div>
              </div>
              <div className="mt-2 mb-2">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-black">Completion</span>
                  <span className="text-sm font-medium text-black">
                    {Math.round(
                      (stats.completedAssignments /
                        assignments?.assignment?.length) *
                        100
                    )}
                    %
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                    style={{
                      width: `${
                        (stats.completedAssignments /
                          assignments?.assignment?.length) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between items-center bg-gray-50 -mx-6 px-6 py-3 border-t">
                <div>
                  <span className="text-purple-600 font-semibold">
                    {stats.completedAssignments}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">Completed</span>
                </div>
                <div>
                  <span className="text-red-500 font-semibold">
                    {assignments?.assignment?.length -
                      stats.completedAssignments}
                  </span>
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
                  <p className="text-black text-sm font-medium">
                    Average Grade
                  </p>
                  <p className="text-3xl font-bold text-black">
                    {overallAverage}%
                  </p>
                </div>
              </div>

              <div className="flex justify-center items-center py-2">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-1">
                    <span className="text-blue-700 font-medium">A</span>
                  </div>
                  <span className="text-xs text-black">
                    {subjectCount} Courses completed
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 -mx-6 px-6 py-3 border-t">
                <Link
                  to="/student/grades"
                  className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center justify-center"
                >
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
                  <p className="text-black text-sm font-medium">
                    Today's Classes
                  </p>
                  <p className="text-3xl font-bold text-black">
                    {upcomingClasses.length}
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 p-2 rounded-lg mb-2">
                <p className="text-black text-sm font-medium">
                  Next: {formatDateTime(upcomingClasses[0].time)}
                </p>
                <p className="text-black font-medium truncate">
                  {upcomingClasses[0].title}
                </p>
                <p className="text-xs text-black mt-0.5">
                  {upcomingClasses[0].room} • {upcomingClasses[0].teacher}
                </p>
              </div>

              <div className="flex justify-center bg-gray-50 -mx-6 px-6 py-3 border-t mt-3">
                <Link
                  to="/student/timetable"
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
          {/* Course Progress */}
          <motion.div
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden lg:col-span-2"
            variants={itemVariants}
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg text-black">
                  Course Progress
                </h3>
                <Link
                  to="/student/courses"
                  className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
                >
                  View All Courses <FiBarChart2 className="ml-1" />
                </Link>
              </div>
            </div>

            <div className="p-6">
              <div className="divide-y divide-gray-100">
                {classes
                  ?.find((item) => item?._id === Authuser?.classId)
                  ?.subject?.map((el) => ({
                    id: el?._id,
                    name: el?.SubjectName,
                    progress: 75,
                    grade: "A-",
                  }))
                  ?.map((course) => (
                    <div key={course.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-black">
                            {course.name}
                          </h4>
                          
                        </div>
                        <div className="text-right">
                          <span className="font-medium text-black">
                            {course.progress}%
                          </span>
                          <p className="text-sm text-black">Completed</p>
                        </div>
                      </div>
                      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            course.progress >= 80
                              ? "bg-gradient-to-r from-green-500 to-emerald-500"
                              : course.progress >= 60
                              ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                              : "bg-gradient-to-r from-yellow-500 to-amber-500"
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
                <h3 className="font-semibold text-lg text-black">
                  Upcoming Assignments
                </h3>
                <Link
                  to="/student/assignments"
                  className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
                >
                  All Assignments
                </Link>
              </div>
            </div>

            <div className="p-6">
              <div className="divide-y divide-gray-100">
                {assignments?.assignment
                  ?.filter((el) => el?.ClassId?._id === id)
                  ?.map((el) => ({
                    id: el?._id,
                    title: el?.title,
                    course: el?.subject?.SubjectName,
                    dueDate: new Date(el?.dueDate).toLocaleString(),
                    status: "started",
                  }))
                  ?.slice(0, 3)
                  ?.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="py-4 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-start">
                        <div
                          className={`p-2 rounded-lg mr-4 ${
                            assignment.status === "complete"
                              ? "bg-green-100 text-green-700"
                              : assignment.status === "in-progress"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {assignment.status === "complete" ? (
                            <FiCheckSquare className="text-xl" />
                          ) : (
                            <FiClipboard className="text-xl" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-800">
                                {assignment.title}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {assignment.course}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                assignment.status === "complete"
                                  ? "bg-green-100 text-green-800"
                                  : assignment.status === "in-progress"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {assignment.status.replace("-", " ")}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <FiClock className="mr-1" />
                            <span>
                              Due {formatDateTime(assignment.dueDate)}
                            </span>
                          </div>
                          <div className="mt-3 flex space-x-3">
                            <Link
                              to={`/student/assignments/${assignment.id}`}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                            >
                              <FiFileText className="mr-1" />
                              View Details
                            </Link>
                            {assignment.status !== "complete" && (
                              <Link
                                to={`/student/assignments/${assignment.id}/submit`}
                                className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
                              >
                                <FiUpload className="mr-1" />
                                Submit
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                {assignments?.assignment
                  ?.filter((el) => el?.ClassId?._id === id)
                  ?.map((el) => ({
                    id: el?._id,
                    title: el?.title,
                    course: el?.subject?.SubjectName,
                    dueDate: new Date(el?.dueDate).toLocaleString(),
                    status: "started",
                  }))?.length > 3 && (
                  <div className="pt-4 text-sm text-gray-500 font-medium">
                    +
                    {assignments?.assignment
                      ?.filter((el) => el?.ClassId?._id === id)
                      ?.map((el) => ({
                        id: el?._id,
                        title: el?.title,
                        course: el?.subject?.SubjectName,
                        dueDate: new Date(el?.dueDate).toLocaleString(),
                        status: "started",
                      }))?.length - 3}{" "}
                    more assignment
                    {assignments?.assignment
                      ?.filter((el) => el?.ClassId?._id === id)
                      ?.map((el) => ({
                        id: el?._id,
                        title: el?.title,
                        course: el?.subject?.SubjectName,
                        dueDate: new Date(el?.dueDate).toLocaleString(),
                        status: "started",
                      }))?.length -
                      3 >
                    1
                      ? "s"
                      : ""}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default StudentDashboard; 