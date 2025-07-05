import React, { useState, useEffect } from 'react';
import TopNavbar from '../components/Topnavbar';
import { useDispatch, useSelector } from "react-redux";
import {
   getGradeById
} from "../features/Grade";
import { motion } from 'framer-motion';
import { FiDownload, FiPrinter, FiShare2, FiFilter, FiCalendar, FiChevronDown, FiBook, FiBarChart2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const StudentGradeReport = () => {
  const dispatch = useDispatch();
  const { Authuser } = useSelector((state) => state.auth);
  const {  grades } = useSelector((state) => state.Grade);
  const studentId = Authuser?.id;
  
  // Sample data - would be fetched from API in real implementation
  const [gradeData, setGradeData] = useState({
    studentInfo: {
      name: 'Alex Johnson',
      id: 'ST12345',
      grade: '11th Grade',
      program: 'Science & Technology',
      counselor: 'Ms. Rebecca Thompson'
    },
    overallStats: {
      gpa: 3.7,
      averageGrade: 'A-',
      totalCredits: 24,
      completedCourses: 8,
      inProgressCourses: 4
    },
    terms: [
      {
        id: 1,
        name: 'Fall 2023',
        isActive: false,
        courses: [
          { id: 101, name: 'Algebra II', grade: 'A', credits: 3, percentage: 92, notes: 'Excellent work on final project' },
          { id: 102, name: 'Chemistry', grade: 'B+', credits: 4, percentage: 88, notes: 'Good lab work, needs improvement on tests' },
          { id: 103, name: 'World History', grade: 'A-', credits: 3, percentage: 91, notes: 'Outstanding essays and participation' },
          { id: 104, name: 'English Literature', grade: 'A', credits: 3, percentage: 94, notes: 'Exceptional critical analysis skills' }
        ]
      },
      {
        id: 2,
        name: 'Spring 2024',
        isActive: true,
        courses: [
          { id: 105, name: 'Pre-Calculus', grade: 'B', credits: 3, percentage: 85, notes: 'Struggling with trigonometry concepts' },
          { id: 106, name: 'Physics', grade: 'A-', credits: 4, percentage: 91, notes: 'Strong understanding of mechanics' },
          { id: 107, name: 'U.S. History', grade: 'B+', credits: 3, percentage: 87, notes: 'Good research paper, active in discussions' },
          { id: 108, name: 'Advanced English', grade: 'A', credits: 3, percentage: 95, notes: 'Excellent writing skills and analysis' }
        ]
      }
    ],
    gradeDistribution: {
      'A+': 1,
      'A': 3,
      'A-': 2,
      'B+': 2,
      'B': 2,
      'B-': 1,
      'C+': 1,
      'C': 0,
      'C-': 0,
      'D': 0,
      'F': 0
    }
  });

  useEffect(() => {
      dispatch(getGradeById(studentId));
    }, [dispatch]);
  
  console.log(grades)
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

  const [selectedTerm, setSelectedTerm] = useState(gradeData.terms.find(term => term.isActive)?.id || gradeData.terms[0].id);
  const [expandedCourse, setExpandedCourse] = useState(null);

  // Get the currently selected term data
  const currentTerm = gradeData.terms.find(term => term.id === selectedTerm);

  // Calculate term GPA
  const calculateTermGPA = (courses) => {
    if (!courses.length) return 0;
    
    const gradePoints = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'D-': 0.7,
      'F': 0.0
    };
    
    let totalPoints = 0;
    let totalCredits = 0;
    
    courses.forEach(course => {
      totalPoints += gradePoints[course.grade] * course.credits;
      totalCredits += course.credits;
    });
    
    return totalCredits ? (totalPoints / totalCredits).toFixed(2) : 0;
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />

      <motion.div
        className="container mx-auto px-4 py-8 mt-14"
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <motion.div variants={cardVariants}>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Academic Records
            </h1>
            <p className="text-gray-600">
              Complete overview of your academic performance
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="flex flex-wrap gap-2 mt-4 md:mt-0"
          >
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
              <FiDownload /> Export PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <FiPrinter /> Print
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <FiShare2 /> Share
            </button>
          </motion.div>
        </div>

        {/* Student Overview */}
        <motion.div
          variants={cardVariants}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-6 mb-8 shadow-md"
        >
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                {Authuser?.firstName} {Authuser?.lastName}
              </h2>
              <p className="text-blue-100">Email: {Authuser?.email}</p>
              <p className="text-blue-100 mt-1">{Authuser?.role}</p>
            </div>
            {grades.length > 0 && (
              <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
                <div className="flex items-center mb-2">
                  <span className="text-4xl font-bold">
                    {overallAverage !== 0
                      ? Number(overallAverage).toFixed(1)
                      : "In progress"}
                    %
                  </span>
                  <div className="ml-2">
                    <div className="text-sm text-blue-100">Average</div>
                  </div>
                </div>
                <div className="flex gap-4 text-sm text-blue-100">
                  <div>{subjectCount} Courses Completed</div>
                </div>
              </div>
            )}
            { grades.length === 0 && (
              <div className="mt-4 md:mt-0 text-red-200">
                {/* create emoji */}
                <div className="text-4xl mb-2">😞</div>
                <p className="text-sm">No grades submitted for you.</p>
              </div>)}
          </div>
        </motion.div>
        {/* Course List */}
        <motion.div
          variants={cardVariants}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Course
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Assignment(20%)
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Mid(30%)
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Final(50%)
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total(100%)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {grades?.map((course, key) => (
                <React.Fragment key={key}>
                  <tr
                    className={`hover:bg-gray-50 cursor-pointer ${
                      expandedCourse === course?.id ? "bg-gray-50" : ""
                    }`}
                    onClick={() =>
                      setExpandedCourse(
                        expandedCourse === course?.id ? null : course?.id
                      )
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          <FiBook />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {course?.subjectName}
                          </div>
                          <div className="text-sm text-gray-500">
                            Mrs. {course?.teacherName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course?.assignment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course?.midterm}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course?.final}
                    </td>
                    {course?.final && course?.midterm && course?.assignment ? (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                            <div
                              className={`h-2.5 rounded-full ${
                                course.midterm +
                                  course.assignment +
                                  course.final >=
                                90
                                  ? "bg-green-500"
                                  : course.midterm +
                                      course.assignment +
                                      course.final >=
                                    80
                                  ? "bg-blue-500"
                                  : course.midterm +
                                      course.assignment +
                                      course.final >=
                                    70
                                  ? "bg-yellow-500"
                                  : course.midterm +
                                      course.assignment +
                                      course.final >=
                                    60
                                  ? "bg-orange-500"
                                  : "bg-red-500"
                              }`}
                              style={{
                                width: `${
                                  course.midterm +
                                  course.assignment +
                                  course.final
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span>
                            {course.midterm + course.assignment + course.final}%
                          </span>
                        </div>
                      </td>
                    ) : (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        In progress
                      </td>
                    )}
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default StudentGradeReport; 