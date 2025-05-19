import React, { useState, useEffect } from 'react';
import TopNavbar from '../components/Topnavbar';
import { motion } from 'framer-motion';
import { FiDownload, FiPrinter, FiShare2, FiFilter, FiCalendar, FiChevronDown, FiBook, FiBarChart2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const StudentGradeReport = () => {
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Academic Records</h1>
            <p className="text-gray-600">Complete overview of your academic performance</p>
          </motion.div>
          
          <motion.div variants={cardVariants} className="flex flex-wrap gap-2 mt-4 md:mt-0">
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
              <h2 className="text-2xl font-bold mb-1">{gradeData.studentInfo.name}</h2>
              <p className="text-blue-100">ID: {gradeData.studentInfo.id} | {gradeData.studentInfo.grade}</p>
              <p className="text-blue-100 mt-1">Program: {gradeData.studentInfo.program}</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
              <div className="flex items-center mb-2">
                <span className="text-4xl font-bold">{gradeData.overallStats.gpa}</span>
                <div className="ml-2">
                  <div className="text-sm text-blue-100">Cumulative GPA</div>
                  <div className="text-lg font-semibold">{gradeData.overallStats.averageGrade} Average</div>
                </div>
              </div>
              <div className="flex gap-4 text-sm text-blue-100">
                <div>{gradeData.overallStats.totalCredits} Credits Total</div>
                <div>{gradeData.overallStats.completedCourses} Courses Completed</div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Grade Distribution */}
        <motion.div 
          variants={cardVariants}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Grade Distribution</h2>
          
          <div className="flex items-end h-32 mb-4">
            {Object.entries(gradeData.gradeDistribution).map(([grade, count], index) => (
              <div key={grade} className="flex flex-col items-center flex-1" style={{ minWidth: 30 }}>
                <div 
                  className={`w-full mx-1 rounded-t-md ${
                    grade.startsWith('A') ? 'bg-green-500' :
                    grade.startsWith('B') ? 'bg-blue-500' :
                    grade.startsWith('C') ? 'bg-yellow-500' :
                    grade.startsWith('D') ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ height: `${count * 20}px` }}
                ></div>
                <div className="text-xs font-medium mt-1 text-gray-600">{grade}</div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <div>Lower Grades</div>
            <div>Higher Grades</div>
          </div>
        </motion.div>
        
        {/* Term Selection */}
        <motion.div variants={cardVariants} className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Term Grades</h2>
            
            <div className="relative inline-block">
              <select 
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(Number(e.target.value))}
                className="appearance-none pl-3 pr-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer bg-white"
              >
                {gradeData.terms.map(term => (
                  <option key={term.id} value={term.id}>
                    {term.name} {term.isActive ? '(Current)' : ''}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          
          <div className="flex items-center mt-2 mb-4">
            <FiCalendar className="text-gray-400 mr-2" />
            <span className="text-gray-600">
              {currentTerm?.name} — {currentTerm?.isActive ? 'In Progress' : 'Completed'}
            </span>
            <div className="ml-auto flex items-center">
              <span className="text-gray-600 mr-2">Term GPA:</span>
              <span className="font-bold text-blue-600">{calculateTermGPA(currentTerm?.courses || [])}</span>
            </div>
          </div>
        </motion.div>
        
        {/* Course List */}
        <motion.div variants={cardVariants} className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credits
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTerm?.courses.map(course => (
                <React.Fragment key={course.id}>
                  <tr 
                    className={`hover:bg-gray-50 cursor-pointer ${expandedCourse === course.id ? 'bg-gray-50' : ''}`}
                    onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          <FiBook />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{course.name}</div>
                          <div className="text-sm text-gray-500">Course ID: {course.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                        course.grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                        course.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                        course.grade.startsWith('C') ? 'bg-yellow-100 text-yellow-800' :
                        course.grade.startsWith('D') ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {course.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.credits} Credits
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                          <div className={`h-2.5 rounded-full ${
                            course.percentage >= 90 ? 'bg-green-500' :
                            course.percentage >= 80 ? 'bg-blue-500' :
                            course.percentage >= 70 ? 'bg-yellow-500' :
                            course.percentage >= 60 ? 'bg-orange-500' : 'bg-red-500'
                          }`} style={{ width: `${course.percentage}%` }}></div>
                        </div>
                        <span>{course.percentage}%</span>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded details */}
                  {expandedCourse === course.id && (
                    <tr className="bg-gray-50">
                      <td colSpan="4" className="px-6 py-4">
                        <div className="text-sm text-gray-700">
                          <h4 className="font-medium mb-2">Instructor Notes</h4>
                          <p className="text-gray-600 mb-3">{course.notes}</p>
                          
                          <div className="mt-3 flex space-x-3">
                            <Link to={`/student/course/${course.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                              <FiBarChart2 className="mr-1" /> View Detailed Performance
                            </Link>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
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