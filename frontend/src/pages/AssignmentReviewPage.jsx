import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import TopNavbar from "../components/Topnavbar";
import {
  FiFileText,
  FiUsers,
  FiCalendar,
  FiCheckCircle,
  FiDownload,
  FiMessageCircle,
} from "react-icons/fi";
import {
  getAssignmentById,
  getSubmitAssignments,
} from "../features/Assignment";
import toast from "react-hot-toast";

const AssignmentReviewPage = () => {
  const { assignmentId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { Authuser } = useSelector((state) => state.auth);

  const [assignment, setAssignment] = useState(null);
  const { currentAssignment, submitAssignments } = useSelector(
    (state) => state.Assignment
  );
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [gradeValue, setGradeValue] = useState("");
  const [feedback, setFeedback] = useState("");

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    in: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
    out: { opacity: 0 },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 10 },
    in: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const fetchAssignmentData = async () => {
      setIsLoading(true);
      try {
        // Mock API call - replace with actual API call
        setTimeout(() => {
          const mockAssignment = {
            id: assignmentId,
            title: "Mathematics Problem Set",
            description: "Complete problems 1-20 in Chapter 5",
            class: "Class 3",
            subject: "Mathematics",
            dueDate: "2023-12-15",
            createdAt: "2023-12-01",
            maxScore: 100,
            totalStudents: 30,
            submissionCount: 15,
            gradedCount: 10,
          };

          const mockSubmissions = [
            {
              id: "1",
              studentId: "101",
              studentName: "John Doe",
              submittedAt: "2023-12-10T14:30:00",
              status: "submitted",
              grade: null,
              feedback: "",
              attachments: [{ name: "homework1.pdf", size: "1.2 MB" }],
            },
            {
              id: "2",
              studentId: "102",
              studentName: "Jane Smith",
              submittedAt: "2023-12-11T09:15:00",
              status: "graded",
              grade: 85,
              feedback: "Good work, but could improve on section 3.",
              attachments: [
                { name: "assignment.docx", size: "2.1 MB" },
                { name: "notes.pdf", size: "3.4 MB" },
              ],
            },
            {
              id: "3",
              studentId: "103",
              studentName: "Michael Johnson",
              submittedAt: "2023-12-12T16:45:00",
              status: "submitted",
              grade: null,
              feedback: "",
              attachments: [{ name: "michael_homework.pdf", size: "1.5 MB" }],
            },
          ];

          setAssignment(mockAssignment);
          setSubmissions(mockSubmissions);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching assignment data:", error);
        toast.error("Failed to load assignment data");
        setIsLoading(false);
      }
    };

    fetchAssignmentData();
  }, [assignmentId]);
  useEffect(() => {
    if (assignmentId) {
      dispatch(getAssignmentById(assignmentId));
      dispatch(getSubmitAssignments(assignmentId));
    }
  }, [dispatch, assignmentId]);
  console.log("submitAssignments:", submitAssignments);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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

  const getStatusColor = (status) => {
    switch (status) {
      case "graded":
        return "bg-green-100 text-green-800";
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "late":
        return "bg-yellow-100 text-yellow-800";
      case "not_submitted":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredSubmissions = submitAssignments.filter((submission) => {
    if (filter === "all") return true;
    return submission.status === filter;
  });

  const handleGradeSubmission = (submission) => {
    setSelectedSubmission(submission);
    setGradeValue(submission.grade || "");
    setFeedback(submission.feedback || "");
    setShowGradingModal(true);
  };

  const handleSubmitGrade = () => {
    if (!gradeValue || gradeValue < 0 || gradeValue > assignment.maxScore) {
      toast.error("Please enter a valid grade");
      return;
    }

    // Mock API call to update grade
    const updatedSubmissions = submissions.map((sub) =>
      sub.id === selectedSubmission.id
        ? { ...sub, grade: Number(gradeValue), feedback, status: "graded" }
        : sub
    );

    setSubmissions(updatedSubmissions);
    setShowGradingModal(false);
    toast.success("Grade submitted successfully");
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
            <h1 className="text-xl font-bold text-red-500">
              Assignment not found
            </h1>
            <p className="mt-2 text-gray-600">
              The assignment you are looking for does not exist or you don't
              have permission to view it.
            </p>
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
                <span>
                  {currentAssignment?.assignment?.subject?.SubjectName}
                </span>
                <span className="mx-2">•</span>
                <span>{currentAssignment?.assignment?.ClassId?.ClassName}</span>
                <span className="mx-2">•</span>
                <span>
                  Due: {formatDate(currentAssignment?.assignment?.dueDate)}
                </span>
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
                        Comment
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        file
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSubmissions.map((submission, key) => (
                      <tr key={key}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {key+1}. {submission?.StudentName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              submission?.status
                            )}`}
                          >
                            {submission?.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDateTime(submission?.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {submission?.comment}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            {submission?.status === "submitted" && (
                              <button className="text-blue-600 hover:text-blue-800">
                                <a href={submission?.answerUrl} target="_blank">
                                  <FiDownload className="w-5 h-5" />
                                </a>
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

      
    </div>
  );
};

export default AssignmentReviewPage;
