import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import TopNavbar from '../components/Topnavbar';
import { FiFileText, FiUsers, FiCalendar, FiCheckCircle, FiEdit, FiDownload, FiUpload, FiMessageCircle } from 'react-icons/fi';
import { getAssignmentById } from "../features/Assignment";

const AssignmentDetailsPage = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [filter, setFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeValue, setGradeValue] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showGradingModal, setShowGradingModal] = useState(false);

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    in: { 
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    },
    out: { opacity: 0 }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 10 },
    in: { opacity: 1, y: 0 }
  };

  // Mock data - would be replaced with actual API data
  useEffect(() => {
    const fetchAssignment = async () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockAssignment = {
          _id: assignmentId,
          title: 'Term Project: Data Structures Implementation',
          description: 'Implement a set of data structures including Linked Lists, Binary Trees, and Hash Maps in your preferred programming language. Include proper documentation and tests for each implementation.',
          subject: 'Computer Science',
          class: 'Class 12',
          dueDate: '2023-12-15',
          totalPoints: 100,
          createdAt: '2023-11-15',
          attachments: [
            { name: 'project_requirements.pdf', url: '#', size: '258 KB' },
            { name: 'example_code.zip', url: '#', size: '1.2 MB' }
          ]
        };

        const mockSubmissions = [
          { 
            id: '1', 
            studentName: 'John Smith', 
            studentId: 'STD001', 
            submittedAt: '2023-12-13T14:23:00', 
            status: 'submitted', 
            files: [{ name: 'john_smith_project.zip', url: '#', size: '1.5 MB' }],
            grade: null,
            feedback: null 
          },
          { 
            id: '2', 
            studentName: 'Emma Johnson', 
            studentId: 'STD002', 
            submittedAt: '2023-12-10T09:45:00', 
            status: 'graded', 
            files: [{ name: 'emma_johnson_project.zip', url: '#', size: '2.3 MB' }],
            grade: 92,
            feedback: 'Excellent work on the hash map implementation. Your code is well-organized and thoroughly tested.' 
          },
          { 
            id: '3', 
            studentName: 'Michael Brown', 
            studentId: 'STD003', 
            submittedAt: '2023-12-14T16:30:00', 
            status: 'submitted', 
            files: [{ name: 'michael_brown_project.zip', url: '#', size: '1.8 MB' }],
            grade: null,
            feedback: null 
          },
          { 
            id: '4', 
            studentName: 'Sophia Garcia', 
            studentId: 'STD004', 
            submittedAt: null, 
            status: 'not_submitted', 
            files: [],
            grade: null,
            feedback: null 
          }
        ];

        setAssignment(mockAssignment);
        setSubmissions(mockSubmissions);
        setIsLoading(false);
      }, 800);
    };

    fetchAssignment();
  }, [assignmentId]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'Not submitted';
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'graded':
        return 'bg-green-100 text-green-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'not_submitted':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'graded':
        return <FiCheckCircle className="mr-1" />;
      case 'submitted':
        return <FiUpload className="mr-1" />;
      case 'late':
        return <FiCalendar className="mr-1" />;
      case 'not_submitted':
        return <FiFileText className="mr-1" />;
      default:
        return null;
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    if (filter === 'all') return true;
    return submission.status === filter;
  });

  const getSubmissionStats = () => {
    const total = submissions.length;
    const submitted = submissions.filter(s => s.status === 'submitted' || s.status === 'graded').length;
    const graded = submissions.filter(s => s.status === 'graded').length;
    const notSubmitted = submissions.filter(s => s.status === 'not_submitted').length;
    
    return {
      total,
      submitted,
      graded,
      notSubmitted,
      submissionRate: total > 0 ? Math.round((submitted / total) * 100) : 0
    };
  };
  
  const stats = getSubmissionStats();

  const handleGradeSubmission = (submission) => {
    setSelectedSubmission(submission);
    setGradeValue(submission.grade || '');
    setFeedback(submission.feedback || '');
    setShowGradingModal(true);
  };

  const handleSubmitGrade = () => {
    // Simulate API call to update grade
    const updatedSubmissions = submissions.map(sub => 
      sub.id === selectedSubmission.id 
        ? {...sub, grade: Number(gradeValue), feedback, status: 'graded'} 
        : sub
    );
    
    setSubmissions(updatedSubmissions);
    setShowGradingModal(false);
    // In a real app, dispatch an action to update the grade
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-xl font-bold text-red-500">Assignment not found</h1>
            <p className="mt-2 text-gray-600">The assignment you are looking for does not exist or you don't have permission to view it.</p>
            <button 
              onClick={() => navigate(-1)} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />
      
      <motion.div 
        className="container mx-auto px-4 py-8"
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
      >
        {/* Header */}
        <motion.div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6" variants={itemVariants}>
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)} 
              className="mr-4 p-2 rounded-full hover:bg-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{assignment.title}</h1>
              <div className="flex items-center mt-1 text-sm text-gray-600">
                <span>{assignment.subject}</span>
                <span className="mx-2">•</span>
                <span>{assignment.class}</span>
                <span className="mx-2">•</span>
                <span>Due: {formatDate(assignment.dueDate)}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex">
            <button 
              onClick={() => {/* Add edit functionality */}} 
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-2"
            >
              <FiEdit className="mr-1" /> Edit
            </button>
            <button 
              onClick={() => window.print()} 
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FiDownload className="mr-1" /> Download
            </button>
          </div>
        </motion.div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Assignment details */}
          <motion.div className="lg:col-span-1" variants={itemVariants}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
              <div className="p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Assignment Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                    <p className="mt-1 text-gray-800">{assignment.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Points</h3>
                    <p className="mt-1 text-gray-800">{assignment.totalPoints}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
                    <p className="mt-1 text-gray-800">{formatDate(assignment.dueDate)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Created</h3>
                    <p className="mt-1 text-gray-800">{formatDate(assignment.createdAt)}</p>
                  </div>

                  {assignment.attachments && assignment.attachments.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Attachments</h3>
                      <ul className="mt-2 space-y-2">
                        {assignment.attachments.map((file, index) => (
                          <li key={index}>
                            <a 
                              href={file.url}
                              className="flex items-center p-2 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200"
                            >
                              <FiFileText className="text-blue-500 mr-2" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-700">{file.name}</p>
                                <p className="text-xs text-gray-500">{file.size}</p>
                              </div>
                              <FiDownload className="text-gray-400" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submission Stats */}
            <motion.div className="bg-white rounded-lg shadow-md overflow-hidden" variants={itemVariants}>
              <div className="p-1 bg-gradient-to-r from-green-500 to-emerald-600"></div>
              <div className="p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Submission Statistics</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Students</span>
                    <span className="font-medium">{stats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Submissions</span>
                    <span className="font-medium">{stats.submitted} ({stats.submissionRate}%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Graded</span>
                    <span className="font-medium">{stats.graded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Not Submitted</span>
                    <span className="font-medium">{stats.notSubmitted}</span>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Submission Progress</span>
                      <span>{stats.submissionRate}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full" 
                        style={{ width: `${stats.submissionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right column - Submissions */}
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-800 mb-2 sm:mb-0">Student Submissions</h2>
                  
                  <div className="flex items-center space-x-2">
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                    >
                      <option value="all">All</option>
                      <option value="submitted">Submitted</option>
                      <option value="graded">Graded</option>
                      <option value="not_submitted">Not Submitted</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSubmissions.map(submission => (
                      <tr key={submission.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="font-medium text-gray-600">
                                {submission.studentName.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{submission.studentName}</div>
                              <div className="text-sm text-gray-500">ID: {submission.studentId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                            {getStatusIcon(submission.status)}
                            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1).replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDateTime(submission.submittedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {submission.grade !== null ? (
                            <span className="font-medium text-green-600">{submission.grade} / {assignment.totalPoints}</span>
                          ) : (
                            <span className="text-gray-400">Not graded</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            {submission.status === 'submitted' && (
                              <button 
                                onClick={() => handleGradeSubmission(submission)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Grade
                              </button>
                            )}
                            {submission.status === 'graded' && (
                              <button 
                                onClick={() => handleGradeSubmission(submission)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Update
                              </button>
                            )}
                            {submission.files && submission.files.length > 0 && (
                              <button className="text-green-600 hover:text-green-800">
                                View
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredSubmissions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No submissions match the selected filter
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Grading Modal */}
      {showGradingModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Grade Submission - {selectedSubmission.studentName}
                </h2>
                <button 
                  onClick={() => setShowGradingModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Submission Date</label>
                  <p className="mt-1 text-gray-800">{formatDateTime(selectedSubmission.submittedAt)}</p>
                </div>

                {selectedSubmission.files && selectedSubmission.files.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Files</label>
                    <ul className="mt-1 space-y-2">
                      {selectedSubmission.files.map((file, index) => (
                        <li key={index} className="flex items-center p-2 bg-gray-50 rounded border border-gray-200">
                          <FiFileText className="text-blue-500 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">{file.name}</p>
                            <p className="text-xs text-gray-500">{file.size}</p>
                          </div>
                          <a href={file.url} className="ml-auto text-blue-600 hover:text-blue-800">
                            <FiDownload />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
                    Grade (out of {assignment.totalPoints})
                  </label>
                  <input
                    type="number"
                    id="grade"
                    min="0"
                    max={assignment.totalPoints}
                    value={gradeValue}
                    onChange={(e) => setGradeValue(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">
                    Feedback
                  </label>
                  <textarea
                    id="feedback"
                    rows="4"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Provide feedback to the student..."
                  ></textarea>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button 
                  onClick={() => setShowGradingModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmitGrade}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Save Grade
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentDetailsPage; 