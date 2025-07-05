import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import TopNavbar from "../components/Topnavbar";
import {
  createAssignment,
  getAssignmentsByTeacherId, deleteAssignment
} from "../features/Assignment";
import { getTeacherById } from "../features/Teacher";
import { format } from "date-fns";
import toast from "react-hot-toast";

function TeachersAssignmentpage() {
  const dispatch = useDispatch();
  const { assignmentId } = useParams();
  const { Authuser } = useSelector((state) => state.auth);
  const { teacherDetails } = useSelector((state) => state.Teacher);
  const { assignments, isLoading } = useSelector((state) => state.Assignment);
  const teacheId = Authuser?.id || Authuser?._id;
  
  const [activeTab, setActiveTab] = useState("all"); 
  const [showAddModal, setShowAddModal] = useState(false);


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

  
  const classOptions = teacherDetails?.classId;
  const subjectOptions = teacherDetails?.subjects;

  
  useEffect(() => {
    if (teacheId) {
      dispatch(getTeacherById(teacheId));
      dispatch(getAssignmentsByTeacherId(teacheId));
    }
  }, [dispatch, teacheId]);
  console.log(assignments);

 


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


  const handleDeleteAssignment = (assignmentId) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      
      dispatch(deleteAssignment(assignmentId))
      .unwrap()
      .then(() => {
        dispatch(getAssignmentsByTeacherId(teacheId));
        toast.success("Assignment deleted successfully!");
      })
    }
  };

  
  if (assignmentId) {
    
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
                            {new Date(assignment?.dueDate).toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500">
                            {" "}
                            {assignment?.gradedCount} in progress
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
    </div>
  );
}

export default TeachersAssignmentpage;
