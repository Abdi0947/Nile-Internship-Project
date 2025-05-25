import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import TopNavbar from "../components/Topnavbar";
import {
  createAssignment,
  getAssignmentsByTeacherId,
} from "../features/Assignment";
import { getTeacherById } from "../features/Teacher";
import { format } from "date-fns";
import toast from "react-hot-toast";

function TeachersAssignmentpage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { assignmentId } = useParams();
  const { Authuser } = useSelector((state) => state.auth);
  const { teacherDetails } = useSelector((state) => state.Teacher);
  const { assignments, isLoading } = useSelector((state) => state.Assignment);
  const teacheId = Authuser.id || Authuser._id;
  const [assignmentsData, setAssignments] = useState([]);
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'pending', 'graded'
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [isSubmissionsLoading, setIsSubmissionsLoading] = useState(false);

  // Form state for new assignment
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    class: "",
    subject: "",
    dueDate: format(
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      "yyyy-MM-dd"
    ), // Default to 1 week from now
    maxScore: 100,
    attachments: [],
  });

  // Mock class and subject options (replace with actual data from your API)
  const classOptions = teacherDetails?.classId;
  const subjectOptions = teacherDetails?.subjects;

  // Mock data for assignmentsData (replace with actual API calls)
  useEffect(() => {
    const fetchAssignments = async () => {
      setIsLoading(true);
      try {
        // Mock API call - replace with actual API call
        setTimeout(() => {
          const mockAssignments = [
            {
              id: "1",
              title: "Mathematics Problem Set",
              description: "Complete problems 1-20 in Chapter 5",
              class: "Class 3",
              subject: "Mathematics",
              dueDate: "2023-12-15",
              createdAt: "2023-12-01",
              maxScore: 100,
              submissionCount: 15,
              gradedCount: 10,
            },
            {
              id: "2",
              title: "Science Lab Report",
              description:
                "Write a lab report on the photosynthesis experiment",
              class: "Class 4",
              subject: "Science",
              dueDate: "2023-12-20",
              createdAt: "2023-12-05",
              maxScore: 50,
              submissionCount: 8,
              gradedCount: 0,
            },
            {
              id: "3",
              title: "English Essay",
              description: "Write a 500-word essay on your favorite book",
              class: "Class 5",
              subject: "English",
              dueDate: "2023-12-18",
              createdAt: "2023-12-04",
              maxScore: 100,
              submissionCount: 20,
              gradedCount: 15,
            },
          ];
          setAssignments(mockAssignments);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching assignmentsData:", error);
        toast.error("Failed to load assignmentsData");
        setIsLoading(false);
      }
    };

    fetchAssignments();
  }, []);
  
  useEffect(() => {
    if (teacheId) {
      dispatch(getTeacherById(teacheId));
      dispatch(getAssignmentsByTeacherId(teacheId));
    }
  }, [dispatch, teacheId]);
  console.log(assignments);

  // If assignmentId is present, fetch and display only that assignment
  useEffect(() => {
    if (assignmentId) {
      const assignment = assignmentsData.find((a) => a.id === assignmentId);
      if (assignment) {
        setCurrentAssignment(assignment);
        setShowViewModal(true);
        // Mock API call to fetch submissions for this assignment
        setIsSubmissionsLoading(true);
        setTimeout(() => {
          const mockSubmissions = [
            {
              id: "1",
              studentId: "101",
              studentName: "John Doe",
              submittedAt: "2023-12-10T14:30:00",
              status: "submitted",
              grade: null,
              feedback: "",
              attachments: ["homework1.pdf"],
            },
            {
              id: "2",
              studentId: "102",
              studentName: "Jane Smith",
              submittedAt: "2023-12-11T09:15:00",
              status: "graded",
              grade: 85,
              feedback: "Good work, but could improve on section 3.",
              attachments: ["assignment.docx", "notes.pdf"],
            },
            {
              id: "3",
              studentId: "103",
              studentName: "Michael Johnson",
              submittedAt: "2023-12-12T16:45:00",
              status: "submitted",
              grade: null,
              feedback: "",
              attachments: ["michael_homework.pdf"],
            },
          ];
          setSubmissions(mockSubmissions);
          setIsSubmissionsLoading(false);
        }, 1000);
      } else {
        toast.error("Assignment not found");
        navigate("/teacher/TeachersAssignmentpage");
      }
    }
  }, [assignmentId, assignmentsData, navigate]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  };

  const removeAttachment = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.title ||
      !formData.description ||
      !formData.class ||
      !formData.subject ||
      !formData.dueDate
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    // Mock API call to create assignment
    try {
      const id = Authuser.id || Authuser.id;
      dispatch(createAssignment({ id, formData })).unwrap()
      .then(() => {
        dispatch(getAssignmentsByTeacherId(teacheId))
      });

      toast.success("Assignment created successfully!");
      setShowAddModal(false);

      // Reset form
      setFormData({
        title: "",
        description: "",
        class: "",
        subject: "",
        dueDate: format(
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          "yyyy-MM-dd"
        ),
        maxScore: 100,
        attachments: [],
      });
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Error creating assignment");
    }
  };

  const handleViewAssignment = (assignment) => {
    setCurrentAssignment(assignment);
    setShowViewModal(true);

    // Mock API call to fetch submissions for this assignment
    setIsSubmissionsLoading(true);
    setTimeout(() => {
      const mockSubmissions = [
        {
          id: "1",
          studentId: "101",
          studentName: "John Doe",
          submittedAt: "2023-12-10T14:30:00",
          status: "submitted",
          grade: null,
          feedback: "",
          attachments: ["homework1.pdf"],
        },
        {
          id: "2",
          studentId: "102",
          studentName: "Jane Smith",
          submittedAt: "2023-12-11T09:15:00",
          status: "graded",
          grade: 85,
          feedback: "Good work, but could improve on section 3.",
          attachments: ["assignment.docx", "notes.pdf"],
        },
        {
          id: "3",
          studentId: "103",
          studentName: "Michael Johnson",
          submittedAt: "2023-12-12T16:45:00",
          status: "submitted",
          grade: null,
          feedback: "",
          attachments: ["michael_homework.pdf"],
        },
      ];
      setSubmissions(mockSubmissions);
      setIsSubmissionsLoading(false);
    }, 1000);
  };

  const handleGradeSubmission = (submissionId, grade, feedback) => {
    // Mock API call to update grade
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === submissionId
          ? { ...sub, grade, feedback, status: "graded" }
          : sub
      )
    );
  };

  const handleDeleteAssignment = (assignmentId) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      // Mock API call to delete assignment
      setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
    }
  };

  // If assignmentId is present, show only that assignment's details
  if (assignmentId) {
    const assignment = assignmentsData.find((a) => a.id === assignmentId);
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gray-100">
          <TopNavbar />
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      );
    }
    if (!assignments) {
      return (
        <div className="min-h-screen bg-gray-100">
          <TopNavbar />
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-500 text-lg">Assignment not found.</p>
            <Link
              to="/teacher/TeachersAssignmentpage"
              className="mt-4 text-blue-600 hover:underline"
            >
              Back to Assignments
            </Link>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-gray-100">
        <TopNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {assignment.title}
            </h1>
            <p className="mb-2 text-gray-700">
              <span className="font-semibold">Class:</span> {assignment.class}
            </p>
            <p className="mb-2 text-gray-700">
              <span className="font-semibold">Subject:</span>{" "}
              {assignment.subject}
            </p>
            <p className="mb-2 text-gray-700">
              <span className="font-semibold">Due Date:</span>{" "}
              {assignment.dueDate}
            </p>
            <p className="mb-2 text-gray-700">
              <span className="font-semibold">Max Score:</span>{" "}
              {assignment.maxScore}
            </p>
            <p className="mb-4 text-gray-700">
              <span className="font-semibold">Description:</span>{" "}
              {assignment.description}
            </p>
            <div className="flex gap-4">
              <Link
                to="/teacher/TeachersAssignmentpage"
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Back
              </Link>
              {/* You can add more actions here, e.g., view submissions, edit, etc. */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Assignment Management
            </h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create New Assignment
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b mb-6">
            <button
              className={`py-2 px-4 mr-2 ${
                activeTab === "all"
                  ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("all")}
            >
              All Assignments
            </button>
            <button
              className={`py-2 px-4 mr-2 ${
                activeTab === "pending"
                  ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("pending")}
            >
              Pending Grading
            </button>
            <button
              className={`py-2 px-4 ${
                activeTab === "graded"
                  ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("graded")}
            >
              Fully Graded
            </button>
          </div>

          {/* Assignments List */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : assignments?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">Title</th>
                    <th className="py-3 px-4 text-left">Class</th>
                    <th className="py-3 px-4 text-left">Subject</th>
                    <th className="py-3 px-4 text-left">Due Date</th>
                    <th className="py-3 px-4 text-left">Submissions</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {assignments?.map((assignment) => (
                    <tr key={assignment.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{assignment?.title}</p>
                          <p className="text-sm text-gray-500">
                            Created:{" "}
                            {new Date(assignment?.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {assignment?.ClassId?.ClassName}
                      </td>
                      <td className="py-3 px-4">
                        {assignment?.subject?.SubjectName}
                      </td>
                      <td className="py-3 px-4">assignments</td>
                      <td className="py-3 px-4">
                        <div>
                          <span className="font-medium">
                            {assignment?.submissionCount}
                          </span>
                          <span className="text-sm text-gray-500">
                            {" "}
                            ({assignment?.gradedCount} graded)
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Link
                            to={`/teacher/TeachersAssignmentpage/${assignment?._id}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Details
                          </Link>
                          <button
                            onClick={() => handleViewAssignment(assignment)}
                            className="text-blue-600 hover:text-blue-800 ml-2"
                          >
                            Submissions
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteAssignment(assignment._id)
                            }
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No assignmentsData found
            </div>
          )}
        </div>
      </div>

      {/* Create Assignment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Assignment</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  rows="4"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class
                  </label>
                  <select
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Class</option>
                    <option key={classOptions._id} value={classOptions?._id}>
                      {classOptions?.ClassName}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Subject</option>

                    <option
                      key={subjectOptions?._id}
                      value={subjectOptions?._id}
                    >
                      {subjectOptions?.SubjectName}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Score
                  </label>
                  <input
                    type="number"
                    name="maxScore"
                    value={formData.maxScore}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attachments
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded"
                  multiple
                />
                {formData.attachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {formData.attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded"
                      >
                        <span className="text-sm truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Assignment Modal */}
      {showViewModal && currentAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{currentAssignment.title}</h2>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setCurrentAssignment(null);
                  setSubmissions([]);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
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

            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Class</p>
                  <p className="font-medium">{currentAssignment.class}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Subject</p>
                  <p className="font-medium">{currentAssignment.subject}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="font-medium">{currentAssignment.dueDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Max Score</p>
                  <p className="font-medium">{currentAssignment.maxScore}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500">Description</p>
                <p className="mt-1">{currentAssignment.description}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">
                Student Submissions
              </h3>

              {isSubmissionsLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : submissions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-2 px-4 border text-left">Student</th>
                        <th className="py-2 px-4 border text-left">
                          Submitted
                        </th>
                        <th className="py-2 px-4 border text-left">Status</th>
                        <th className="py-2 px-4 border text-left">Grade</th>
                        <th className="py-2 px-4 border text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((submission) => {
                        const [gradeInput, setGradeInput] = useState(
                          submission.grade || ""
                        );
                        const [feedbackInput, setFeedbackInput] = useState(
                          submission.feedback || ""
                        );
                        const [isGrading, setIsGrading] = useState(false);

                        return (
                          <tr key={submission.id}>
                            <td className="py-2 px-4 border">
                              {submission.studentName}
                            </td>
                            <td className="py-2 px-4 border">
                              {format(
                                new Date(submission.submittedAt),
                                "dd/MM/yyyy HH:mm"
                              )}
                            </td>
                            <td className="py-2 px-4 border">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  submission.status === "graded"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {submission.status}
                              </span>
                            </td>
                            <td className="py-2 px-4 border">
                              {isGrading ? (
                                <input
                                  type="number"
                                  value={gradeInput}
                                  onChange={(e) =>
                                    setGradeInput(e.target.value)
                                  }
                                  className="w-full p-1 border rounded"
                                  min="0"
                                  max={currentAssignment.maxScore}
                                />
                              ) : submission.grade !== null ? (
                                submission.grade
                              ) : (
                                "-"
                              )}
                            </td>
                            <td className="py-2 px-4 border">
                              {isGrading ? (
                                <div className="space-y-2">
                                  <div>
                                    <label className="block text-xs text-gray-500">
                                      Feedback
                                    </label>
                                    <textarea
                                      value={feedbackInput}
                                      onChange={(e) =>
                                        setFeedbackInput(e.target.value)
                                      }
                                      className="w-full p-1 border rounded text-sm"
                                      rows="2"
                                    ></textarea>
                                  </div>
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => {
                                        handleGradeSubmission(
                                          submission.id,
                                          parseInt(gradeInput),
                                          feedbackInput
                                        );
                                        setIsGrading(false);
                                      }}
                                      className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setIsGrading(false)}
                                      className="px-2 py-1 bg-gray-300 text-gray-700 text-xs rounded"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => setIsGrading(true)}
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    {submission.status === "graded"
                                      ? "Edit Grade"
                                      : "Grade"}
                                  </button>
                                  <button className="text-green-600 hover:text-green-800">
                                    View
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No submissions yet
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeachersAssignmentpage;
