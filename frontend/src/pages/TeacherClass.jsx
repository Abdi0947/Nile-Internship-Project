import React, { useState, useEffect } from "react";
import { getSubjectById } from "../features/Subject";
import {
  fetchAllStudents
} from "../features/Student";
import TopNavbar from "../components/Topnavbar";
import { useSelector, useDispatch } from "react-redux";
import {
  FaBook,
  FaFlask,
  FaAtom,
  FaHistory,
  FaCheckCircle,
  FaInfoCircle,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaChartBar,
} from "react-icons/fa";
import toast from "react-hot-toast";

function TeacherClass() {
  const dispatch = useDispatch();
  const { Authuser } = useSelector((state) => state.auth);
  const teacheId = Authuser?.id || Authuser?._id || "";
  const { students } = useSelector((state) => state.Student);
  const { subjects, isLoading  } = useSelector((state) => state.Subject);
  const subjectId = Authuser?.subject;
  const yourStudent = students?.filter(
    (item) => item?.classId?._id === Authuser?.classId
  );

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [activeTab, setActiveTab] = useState("students"); // students, activities, performance
  const [studentsData, setStudents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [performanceData, setPerformanceData] = useState({});
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [newActivity, setNewActivity] = useState({
    title: "",
    description: "",
    type: "assignment",
    dueDate: "",
    maxScore: 100,
  });

  
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        // Mock API call - replace with actual API call
        setTimeout(() => {
          const mockClasses = [
            {
              id: subjects?._id,
              name: subjects?.ClassId?.ClassName,
              subject: subjects?.SubjectName,
              schedule: "Mon, Wed, Fri 9:00 AM - 10:00 AM",
              studentCount: 25,
              averagePerformance: 78,
            },
          ];
          setClasses(mockClasses);
        
        }, 1000);
      } catch (error) {
        console.error("Error fetching classes:", error);
        toast.error("Failed to load classes");
        
      }
    };

    fetchClasses();
    dispatch(getSubjectById(subjectId));
    dispatch(fetchAllStudents());
  }, [dispatch]);
  console.log(yourStudent)
  // Fetch class details when a class is selected
  useEffect(() => {
    if (selectedClass) {
      fetchClassDetails(selectedClass.id);
    }
  }, [selectedClass]);
  

  console.log(isLoading);

  const fetchClassDetails = (classId) => {
   

    // Mock API call for students in class
    setTimeout(() => {
      
      setStudents(
        yourStudent.map((el) => ({
          id: el?._id,
          name: `${el?.firstName} ${el?.lastName}`,
          attendance: 78,
          averageGrade: 72,
          lastActivity: "2023-12-09",
        }))
      );

      // Mock API call for class activities
      const mockActivities = [
        {
          id: "a1",
          title: "Chapter 5 Problems",
          type: "assignment",
          description: "Complete problems 1-20 in Chapter 5",
          dueDate: "2023-12-15",
          submissionCount: 15,
          maxScore: 100,
        },
        {
          id: "a2",
          title: "Mid-term Exam",
          type: "exam",
          description: "Covers chapters 1-5",
          dueDate: "2023-12-20",
          submissionCount: 22,
          maxScore: 100,
        },
        {
          id: "a3",
          title: "Group Project",
          type: "project",
          description: "Create a presentation on the assigned topic",
          dueDate: "2023-12-18",
          submissionCount: 18,
          maxScore: 50,
        },
      ];
      setActivities(mockActivities);

      // Mock API call for performance data
      const mockPerformanceData = {
        attendanceRate: 90,
        averageGrade: 82,
        submissionRate: 88,
        gradeDistribution: {
          A: 5,
          B: 8,
          C: 7,
          D: 3,
          F: 2,
        },
        recentPerformance: [78, 80, 82, 79, 85, 83, 87],
      };
      setPerformanceData(mockPerformanceData);

      
    }, 1000);
  };

  const handleSelectClass = (classData) => {
    setSelectedClass(classData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewActivity((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddActivity = (e) => {
    e.preventDefault();

    // Validate form
    if (
      !newActivity.title ||
      !newActivity.description ||
      !newActivity.dueDate
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    // Mock API call to add activity
    const newActivityWithId = {
      id: `a${Date.now()}`,
      ...newActivity,
      submissionCount: 0,
    };

    setActivities((prev) => [newActivityWithId, ...prev]);
    // toast.success('Activity added successfully');
    setShowAddActivityModal(false);

    // Reset form
    setNewActivity({
      title: "",
      description: "",
      type: "assignment",
      dueDate: "",
      maxScore: 100,
    });
  };

  const handleDeleteActivity = (activityId) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      // Mock API call to delete activity
      setActivities((prev) => prev.filter((a) => a.id !== activityId));
      // toast.success('Activity deleted successfully');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Classes</h1>

          {isLoading && !selectedClass ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {classes?.map((classItem) => (
                <div
                  key={classItem.id}
                  onClick={() => handleSelectClass(classItem)}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedClass?.id === classItem.id
                      ? "border-blue-500 bg-blue-50"
                      : "hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <div className="p-2 bg-blue-100 rounded-full mr-3">
                      {classItem?.subject === "Mathematics" && (
                        <FaAtom className="text-blue-600" />
                      )}
                      {classItem?.subject === "Science" && (
                        <FaFlask className="text-green-600" />
                      )}
                      {classItem?.subject === "ENGLISH11" && (
                        <FaBook className="text-red-600" />
                      )}
                      {classItem?.subject === "History" && (
                        <FaHistory className="text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold">{classItem?.name}</h3>
                      <p className="text-sm text-gray-600">
                        {classItem?.subject}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {classItem?.schedule}
                  </p>
                  <div className="flex justify-between text-sm">
                    <span>{classItem?.studentCount} students</span>
                    <span>Avg: {classItem?.averagePerformance}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedClass && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold">
                  {selectedClass.name} - {selectedClass.subject}
                </h2>
                <p className="text-gray-600">{selectedClass.schedule}</p>
              </div>
              <button
                onClick={() => setSelectedClass(null)}
                className="text-blue-600 hover:text-blue-800"
              >
                Back to All Classes
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b mb-6">
              <button
                className={`py-2 px-4 mr-2 flex items-center ${
                  activeTab === "students"
                    ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("students")}
              >
                <FaUserGraduate className="mr-2" />
                Students
              </button>
              <button
                className={`py-2 px-4 mr-2 flex items-center ${
                  activeTab === "activities"
                    ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("activities")}
              >
                <FaChalkboardTeacher className="mr-2" />
                Activities
              </button>
              <button
                className={`py-2 px-4 flex items-center ${
                  activeTab === "performance"
                    ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("performance")}
              >
                <FaChartBar className="mr-2" />
                Performance
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                {/* Students Tab */}
                {activeTab === "students" && (
                  <div>
                    <div className="mb-4 flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Student Roster</h3>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search students..."
                          className="pl-8 pr-4 py-2 border rounded"
                        />
                        <div className="absolute left-2 top-2.5 text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="py-3 px-4 text-left">Name</th>
                            <th className="py-3 px-4 text-left">Attendance</th>
                            <th className="py-3 px-4 text-left">
                              Average Grade
                            </th>
                            <th className="py-3 px-4 text-left">
                              Last Activity
                            </th>
                            <th className="py-3 px-4 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {studentsData.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50">
                              <td className="py-3 px-4">{student.name}</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <span
                                    className={`mr-2 ${
                                      student.attendance >= 90
                                        ? "text-green-600"
                                        : student.attendance >= 80
                                        ? "text-yellow-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {student.attendance}%
                                  </span>
                                  <div className="w-24 h-2 bg-gray-200 rounded">
                                    <div
                                      className={`h-full rounded ${
                                        student.attendance >= 90
                                          ? "bg-green-500"
                                          : student.attendance >= 80
                                          ? "bg-yellow-500"
                                          : "bg-red-500"
                                      }`}
                                      style={{
                                        width: `${student.attendance}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={
                                    student.averageGrade >= 90
                                      ? "text-green-600"
                                      : student.averageGrade >= 80
                                      ? "text-blue-600"
                                      : student.averageGrade >= 70
                                      ? "text-yellow-600"
                                      : "text-red-600"
                                  }
                                >
                                  {student.averageGrade}%
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                {student.lastActivity}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex space-x-2">
                                  <button className="text-blue-600 hover:text-blue-800">
                                    View
                                  </button>
                                  <button className="text-green-600 hover:text-green-800">
                                    Message
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Activities Tab */}
                {activeTab === "activities" && (
                  <div>
                    <div className="mb-4 flex justify-between items-center">
                      <h3 className="text-lg font-semibold">
                        Class Activities
                      </h3>
                      <button
                        onClick={() => setShowAddActivityModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Add Activity
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="py-3 px-4 text-left">Title</th>
                            <th className="py-3 px-4 text-left">Type</th>
                            <th className="py-3 px-4 text-left">Due Date</th>
                            <th className="py-3 px-4 text-left">Submissions</th>
                            <th className="py-3 px-4 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {activities.map((activity) => (
                            <tr key={activity.id} className="hover:bg-gray-50">
                              <td className="py-3 px-4">
                                <div>
                                  <p className="font-medium">
                                    {activity.title}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {activity.description}
                                  </p>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    activity.type === "assignment"
                                      ? "bg-blue-100 text-blue-800"
                                      : activity.type === "exam"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {activity.type}
                                </span>
                              </td>
                              <td className="py-3 px-4">{activity.dueDate}</td>
                              <td className="py-3 px-4">
                                {activity.submissionCount}/
                                {selectedClass.studentCount}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex space-x-2">
                                  <button className="text-blue-600 hover:text-blue-800">
                                    View
                                  </button>
                                  <button className="text-green-600 hover:text-green-800">
                                    Grade
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteActivity(activity.id)
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
                  </div>
                )}

                {/* Performance Tab */}
                {activeTab === "performance" && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Class Performance
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">
                              Attendance Rate
                            </p>
                            <p className="text-2xl font-bold">
                              {performanceData.attendanceRate}%
                            </p>
                          </div>
                          <div className="p-3 bg-blue-100 rounded-full">
                            <FaCalendarAlt className="text-blue-600" />
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">
                              Average Grade
                            </p>
                            <p className="text-2xl font-bold">
                              {performanceData.averageGrade}%
                            </p>
                          </div>
                          <div className="p-3 bg-green-100 rounded-full">
                            <FaChartBar className="text-green-600" />
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">
                              Submission Rate
                            </p>
                            <p className="text-2xl font-bold">
                              {performanceData.submissionRate}%
                            </p>
                          </div>
                          <div className="p-3 bg-yellow-100 rounded-full">
                            <FaCheckCircle className="text-yellow-600" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-4">Grade Distribution</h4>
                        <div className="space-y-2">
                          {Object.entries(
                            performanceData.gradeDistribution
                          ).map(([grade, count]) => (
                            <div key={grade} className="flex items-center">
                              <span className="w-8 font-medium">{grade}</span>
                              <div className="flex-1 mx-2">
                                <div className="w-full h-6 bg-gray-200 rounded">
                                  <div
                                    className={`h-full rounded ${
                                      grade === "A"
                                        ? "bg-green-500"
                                        : grade === "B"
                                        ? "bg-blue-500"
                                        : grade === "C"
                                        ? "bg-yellow-500"
                                        : grade === "D"
                                        ? "bg-orange-500"
                                        : "bg-red-500"
                                    }`}
                                    style={{
                                      width: `${
                                        (count / selectedClass.studentCount) *
                                        100
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                              <span className="w-8 text-right">{count}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-4">
                          Recent Performance Trend
                        </h4>
                        <div className="h-40 flex items-end space-x-2">
                          {performanceData.recentPerformance.map(
                            (score, index) => (
                              <div
                                key={index}
                                className="flex-1 flex flex-col items-center"
                              >
                                <div
                                  className={`w-full ${
                                    score >= 90
                                      ? "bg-green-500"
                                      : score >= 80
                                      ? "bg-blue-500"
                                      : score >= 70
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                  } rounded-t`}
                                  style={{ height: `${score}%` }}
                                ></div>
                                <span className="text-xs mt-1">
                                  Week {index + 1}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Add Activity Modal */}
      {showAddActivityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Activity</h2>
              <button
                onClick={() => setShowAddActivityModal(false)}
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

            <form onSubmit={handleAddActivity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={newActivity.title}
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
                  value={newActivity.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  rows="3"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    name="type"
                    value={newActivity.type}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="assignment">Assignment</option>
                    <option value="exam">Exam</option>
                    <option value="project">Project</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Score
                  </label>
                  <input
                    type="number"
                    name="maxScore"
                    value={newActivity.maxScore}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={newActivity.dueDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddActivityModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherClass;
