import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { motion } from 'framer-motion';
import TopNavbar from '../components/Topnavbar';
import { FiFileText, FiUsers, FiCalendar, FiCheckCircle, FiDownload, FiMessageCircle } from 'react-icons/fi';
import {getAssignmentById} from '../features/Assignment'
import toast from 'react-hot-toast';

const AssignmentReviewPage = () => {
  const { assignmentId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { Authuser } = useSelector(state => state.auth);
  
  const [assignment, setAssignment] = useState(null);
  const { currentAssignment } = useSelector((state) => state.Assignment);
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [gradeValue, setGradeValue] = useState('');
  const [feedback, setFeedback] = useState('');

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

  useEffect(() => {
    const fetchAssignmentData = async () => {
      setIsLoading(true);
      try {
        // Mock API call - replace with actual API call
        setTimeout(() => {
          const mockAssignment = {
            id: assignmentId,
            title: 'Mathematics Problem Set',
            description: 'Complete problems 1-20 in Chapter 5',
            class: 'Class 3',
            subject: 'Mathematics',
            dueDate: '2023-12-15',
            createdAt: '2023-12-01',
            maxScore: 100,
            totalStudents: 30,
            submissionCount: 15,
            gradedCount: 10
          };

          const mockSubmissions = [
            {
              id: '1',
              studentId: '101',
              studentName: 'John Doe',
              submittedAt: '2023-12-10T14:30:00',
              status: 'submitted',
              grade: null,
              feedback: '',
              attachments: [{ name: 'homework1.pdf', size: '1.2 MB' }]
            },
            {
              id: '2',
              studentId: '102',
              studentName: 'Jane Smith',
              submittedAt: '2023-12-11T09:15:00',
              status: 'graded',
              grade: 85,
              feedback: 'Good work, but could improve on section 3.',
              attachments: [
                { name: 'assignment.docx', size: '2.1 MB' },
                { name: 'notes.pdf', size: '3.4 MB' }
              ]
            },
            {
              id: '3',
              studentId: '103',
              studentName: 'Michael Johnson',
              submittedAt: '2023-12-12T16:45:00',
              status: 'submitted',
              grade: null,
              feedback: '',
              attachments: [{ name: 'michael_homework.pdf', size: '1.5 MB' }]
            }
          ];

          setAssignment(mockAssignment);
          setSubmissions(mockSubmissions);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching assignment data:', error);
        toast.error('Failed to load assignment data');
        setIsLoading(false);
      }
    };

    fetchAssignmentData();
  }, [assignmentId]);
  useEffect(() => {
    if (assignmentId) {
      dispatch(getAssignmentById(assignmentId));
    }
  }, [dispatch, assignmentId]);
  console.log(currentAssignment);

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

  const filteredSubmissions = submissions.filter(submission => {
    if (filter === 'all') return true;
    return submission.status === filter;
  });

  const handleGradeSubmission = (submission) => {
    setSelectedSubmission(submission);
    setGradeValue(submission.grade || '');
    setFeedback(submission.feedback || '');
    setShowGradingModal(true);
  };

  const handleSubmitGrade = () => {
    if (!gradeValue || gradeValue < 0 || gradeValue > assignment.maxScore) {
      toast.error('Please enter a valid grade');
      return;
    }

    // Mock API call to update grade
    const updatedSubmissions = submissions.map(sub => 
      sub.id === selectedSubmission.id 
        ? {...sub, grade: Number(gradeValue), feedback, status: 'graded'} 
        : sub
    );
    
    setSubmissions(updatedSubmissions);
    setShowGradingModal(false);
    toast.success('Grade submitted successfully');
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
        className="container mx-auto px-4 py-8 mt-8"
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
      >
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6"
          variants={itemVariants}
        >
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 rounded-full hover:bg-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {currentAssignment?.assignment?.title}
              </h1>
              <div className="flex items-center mt-1 text-sm text-gray-600">
                <span>{currentAssignment?.assignment?.subject?.SubjectName}</span>
                <span className="mx-2">•</span>
                <span>{currentAssignment?.assignment?.ClassId?.ClassName}</span>
                <span className="mx-2">•</span>
                <span>Due: {formatDate(currentAssignment?.assignment?.dueDate)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Assignment Details */}
          <motion.div className="lg:col-span-1" variants={itemVariants}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
              <div className="p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  Assignment Details
                </h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Description
                    </h3>
                    <p className="mt-1 text-gray-800">
                      {currentAssignment?.assignment?.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Points assignment
                    </h3>
                    <p className="mt-1 text-gray-800">
                      {currentAssignment?.assignment?.maxScore}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Due Date
                    </h3>
                    <p className="mt-1 text-gray-800">
                      {formatDate(currentAssignment?.assignment?.dueDate)}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Created
                    </h3>
                    <p className="mt-1 text-gray-800">
                      {formatDate(currentAssignment?.assignment?.createdAt)}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Submission Progress
                    </h3>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Submissions</span>
                      <span>
                        {currentAssignment?.assignment?.submissionCount}/
                        {currentAssignment?.assignment?.totalStudents}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{
                          width: `${
                            (assignment.submissionCount /
                              assignment.totalStudents) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <div className="mt-2 flex justify-between text-sm">
                      <span>Graded</span>
                      <span>
                        {assignment.gradedCount}/{assignment.submissionCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right column - Submissions */}
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-800 mb-2 sm:mb-0">
                    Student Submissions
                  </h2>

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
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Student
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Submitted
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Grade
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSubmissions.map((submission) => (
                      <tr key={submission.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {submission.studentName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {submission.studentId}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              submission.status
                            )}`}
                          >
                            {submission.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDateTime(submission.submittedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {submission.grade !== null ? (
                            <span className="font-medium text-green-600">
                              {submission.grade} / {assignment.maxScore}
                            </span>
                          ) : (
                            <span className="text-gray-400">Not graded</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            {submission.status === "submitted" && (
                              <button
                                onClick={() =>
                                  handleGradeSubmission(submission)
                                }
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Grade
                              </button>
                            )}
                            {submission.status === "graded" && (
                              <button
                                onClick={() =>
                                  handleGradeSubmission(submission)
                                }
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Update
                              </button>
                            )}
                            {submission.attachments &&
                              submission.attachments.length > 0 && (
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
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Grading Modal */}
      {showGradingModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Grade Submission
                </h3>
                <button
                  onClick={() => setShowGradingModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Student</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedSubmission.studentName}
                  </p>
                </div>

                {selectedSubmission.attachments &&
                  selectedSubmission.attachments.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Files
                      </label>
                      <ul className="mt-1 space-y-2">
                        {selectedSubmission.attachments.map((file, index) => (
                          <li
                            key={index}
                            className="flex items-center p-2 bg-gray-50 rounded border border-gray-200"
                          >
                            <FiFileText className="text-blue-500 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {file.size}
                              </p>
                            </div>
                            <button className="ml-auto text-blue-600 hover:text-blue-800">
                              <FiDownload />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                <div>
                  <label
                    htmlFor="grade"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Grade (out of {assignment.maxScore})
                  </label>
                  <input
                    type="number"
                    id="grade"
                    min="0"
                    max={assignment.maxScore}
                    value={gradeValue}
                    onChange={(e) => setGradeValue(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="feedback"
                    className="block text-sm font-medium text-gray-700"
                  >
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

export default AssignmentReviewPage; 