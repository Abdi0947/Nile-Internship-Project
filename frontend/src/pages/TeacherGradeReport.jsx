import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import {
  getAllAttendance,
  addAttendance,
  removeAttendance,
  updateAttendance,
} from "../features/Attendance";
import {
  createGrade, getAllGrade
} from "../features/Grade";
import { fetchAllStudents } from "../features/Student";
import TopNavbar from "../components/Topnavbar";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import toast from "react-hot-toast";

function TeacherGradeReport() {
  const dispatch = useDispatch();
  const { allAttendance, isAttendanceLoading } = useSelector(
    (state) => state.attendance
  );
  const { Authuser } = useSelector((state) => state.auth);
  const { students } = useSelector((state) => state.Student);
  const { isLoading, grades } = useSelector((state) => state.Grade);
  const yourStudent = students?.filter(
    (item) => item?.classId?._id === Authuser?.classId
  );
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAttendanceId, setEditingAttendanceId] = useState(null);
  const [viewMode, setViewMode] = useState("record"); // 'record' or 'view'
  const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [isUserLogin, setIsUserLogin] = useState(false);
  const [filterParams, setFilterParams] = useState({
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
    class: "",
    subject: "",
    status: "",
  });
  const [newGrade, setNewTeacher] = useState({
    examType: "",
    studentId: "",
    grade: "",
  });
  const teacherId = Authuser?.id;

  // Class and subject options (replace with actual data from your API)
  const examLists = [
    { value: "", label: "Select Exam Type" },
    { value: "Assignment", label: "Assignment" },
    { value: "Midterm", label: "Midterm" },
    { value: "Final", label: "Final" },
  ];

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };
  useEffect(() => {
    dispatch(getAllAttendance());
    dispatch(fetchAllStudents());
    dispatch(getAllGrade(teacherId));
  }, [dispatch]);

  useEffect(() => {
    if (yourStudent && yourStudent?.length > 0 && selectedClass) {
      // In a real app, filter students by class
      const filteredStudents = yourStudent?.filter(
        (student) => student?.status === "active" // Only include active students
      );

      setAttendanceData(
        filteredStudents.map((student) => ({
          studentId: student._id,
          studentName: `${student.firstName} ${student.lastName}`,
          status: "present",
          note: "",
        }))
      );
    }
  }, [students, selectedClass]);

  useEffect(() => {
    if (allAttendance && viewMode === "view") {
      filterAttendanceRecords();
    }
  }, [allAttendance, filterParams, viewMode]);

  const filterAttendanceRecords = () => {
    if (!allAttendance) return;

    const filtered = allAttendance.filter((record) => {
      const recordDate = new Date(record.date);
      const startDate = new Date(filterParams.startDate);
      const endDate = new Date(filterParams.endDate);

      // Reset hours to compare dates only
      recordDate.setHours(0, 0, 0, 0);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      const dateMatches = recordDate >= startDate && recordDate <= endDate;
      const classMatches = filterParams.class
        ? record.class === filterParams.class
        : true;
      const subjectMatches = filterParams.subject
        ? record.subject === filterParams.subject
        : true;

      return dateMatches && classMatches && subjectMatches;
    });

    setFilteredAttendance(filtered);
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceData((prev) =>
      prev.map((item) =>
        item.studentId === studentId ? { ...item, status } : item
      )
    );
  };

  const handleNoteChange = (studentId, note) => {
    setAttendanceData((prev) =>
      prev.map((item) =>
        item.studentId === studentId ? { ...item, note } : item
      )
    );
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedClass || !selectedSubject) {
      toast.error("Please select date, class and subject");
      return;
    }

    if (attendanceData.length === 0) {
      toast.error("No students available for attendance");
      return;
    }

    const attendancePayload = {
      date: selectedDate,
      class: selectedClass,
      subject: selectedSubject,
      attendanceRecords: attendanceData,
    };

    if (isEditing && editingAttendanceId) {
      await dispatch(
        updateAttendance({
          id: editingAttendanceId,
          updatedData: attendancePayload,
        })
      );
      setIsEditing(false);
      setEditingAttendanceId(null);
    } else {
      await dispatch(addAttendance(attendancePayload));
    }

    // Reset form
    setSelectedDate(format(new Date(), "yyyy-MM-dd"));
    setSelectedClass("");
    setSelectedSubject("");
    setAttendanceData([]);
  };

  const handleEdit = (attendance) => {
    setIsEditing(true);
    setEditingAttendanceId(attendance._id);
    setSelectedDate(format(new Date(attendance.date), "yyyy-MM-dd"));
    setSelectedClass(attendance.class);
    setSelectedSubject(attendance.subject);
    setAttendanceData(attendance.attendanceRecords);
    setViewMode("record");
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    try {
      const gradeData = {
        studentId: newGrade.studentId,
        subjectId: Authuser?.subject,
        teacherId: Authuser?.id,
        grade: newGrade.grade,
        examType: newGrade.examType,
      };
      dispatch(createGrade(gradeData))
              .unwrap()
              .then(() => {
                setIsAddTeacherModalOpen(false);
                dispatch(getAllGrade(teacherId));
                toast.success("Teacher added successfully!");
                
              });
    } catch (error) {
      console.log(error);
      toast.error("Failed to add student. Please try again.");
    }
  };

  const handleDelete = (attendanceId) => {
    if (
      window.confirm("Are you sure you want to delete this attendance record?")
    ) {
      dispatch(removeAttendance(attendanceId));
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterParams((prev) => ({ ...prev, [name]: value }));
  };
  console.log(grades);

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Grade Report</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsAddTeacherModalOpen(true)}
                className={`px-4 py-2 rounded ${
                  viewMode === "record"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Create Grade
              </button>
            </div>
          </div>
          <AnimatePresence>
            {isAddTeacherModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                >
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-gray-800">
                        Grade Report
                      </h2>
                      <button
                        onClick={() => setIsAddTeacherModalOpen(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FiX className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleAddTeacher} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Student Name
                        </label>
                        <select
                          value={newGrade.studentId}
                          onChange={(e) =>
                            setNewTeacher({
                              ...newGrade,
                              studentId: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value={""}>Select Student</option>
                          {yourStudent.map((option) => (
                            <option key={option?._id} value={option?._id}>
                              {option?.firstName} {option?.lastName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Exam type
                        </label>
                        <select
                          value={newGrade.examType}
                          onChange={(e) =>
                            setNewTeacher({
                              ...newGrade,
                              examType: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          {examLists.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Grade
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={newGrade.grade}
                          onChange={(e) =>
                            setNewTeacher({
                              ...newGrade,
                              grade: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter grade"
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsAddTeacherModalOpen(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <motion.button
                        variants={itemVariants}
                        type="submit"
                        disabled={isLoading}
                        className={`w-40 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed`}
                        whileHover={{ scale: isLoading ? 1 : 1.03 }}
                        whileTap={{ scale: isLoading ? 1 : 0.98 }}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center">
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Adding Grade...
                          </span>
                        ) : (
                          "Add Grade"
                        )}
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <>
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-4 border text-left">Name</th>
                      <th className="py-2 px-4 border text-left">Mid</th>
                      <th className="py-2 px-4 border text-left">Assigment</th>
                      <th className="py-2 px-4 border text-left">Final</th>
                      <th className="py-2 px-4 border text-left">Total</th>
                      <th className="py-2 px-4 border text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan="6" className="py-4 text-center">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                          </div>
                        </td>
                      </tr>
                    ) : grades && grades.length > 0 ? (
                      grades.map((attendance) => {
                        return (
                          <tr key={attendance?.assignment}>
                            <td className="py-2 px-4 border">
                              {attendance?.studentName}
                            </td>
                            <td className="py-2 px-4 border">
                              {attendance?.midTerm}
                            </td>
                            <td className="py-2 px-4 border">
                              {attendance?.assignment}
                            </td>
                            <td className="py-2 px-4 border">
                              {attendance?.final}
                            </td>
                            <td className="py-2 px-4 border">
                              {attendance?.midTerm &&
                                attendance?.assignment &&
                                attendance?.final ? (`${
                                  attendance?.midTerm +
                                  attendance?.assignment +
                                  attendance?.final
                                }`) : "in progress"}
                                
                            </td>
                            <td className="py-2 px-4 border">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEdit(attendance)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(attendance._id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="py-4 text-center text-gray-500"
                        >
                          No attendance records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          </>
        </div>
      </div>
    </div>
  );
}

export default TeacherGradeReport;
