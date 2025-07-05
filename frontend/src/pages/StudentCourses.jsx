import React, {  useEffect } from "react";
import { Link } from "react-router-dom";
import { FiUser, FiCalendar, FiBarChart2, FiFileText } from "react-icons/fi";
import TopNavbar from "../components/Topnavbar";
import { getClassById } from "../features/Class.js";
import { useDispatch, useSelector } from "react-redux";

const StudentCourses = () => {
  const dispatch = useDispatch();
  const { Authuser } = useSelector((state) => state.auth);
  const { currentClass, isCurrentLoading } = useSelector(
    (state) => state.Class
  );
  const classId = Authuser?.classId || "";

  const mockCourses = [
    {
      description: "Introduction to calculus, linear algebra, and statistics",
      color: "from-blue-500 to-indigo-600",
    },
    {
      description:
        "Fundamental principles of mechanics, thermodynamics, and electromagnetism",
      color: "from-purple-500 to-pink-500",
    },
    {
      description:
        "A survey of world civilizations from ancient times to the present",
      color: "from-amber-500 to-orange-500",
    },
  ];
  useEffect(() => {
    if (classId) {
      dispatch(getClassById(classId));
    } 
  }, [dispatch]);
  
  if (isCurrentLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />
      <div className="container mx-auto px-4 py-10 mt-14">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Courses</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentClass?.map((course, key) => (
            <div
              key={key}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${mockCourses[1]?.color}`}></div>
              <div className="p-6">
                <h3 className="font-bold text-xl text-gray-800 mb-1">
                  {course?.subjectName}
                </h3>
                <div className="flex items-center text-gray-600 mb-1">
                  <FiUser className="mr-2 text-gray-400" />
                  <span className="text-sm">Mrs. {course?.teacherName}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {mockCourses[1]?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentCourses;
