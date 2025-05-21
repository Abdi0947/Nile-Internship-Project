import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import TopNavbar from "../components/Topnavbar";
import { fetchAllStudents, calculateStudentStats } from "../features/Student";
import { AddTeacher } from "../features/Teacher";
import { fetchAllTimetables } from "../features/TimeTable";
import { fetchAllFees } from "../features/Fee";
import { fetchNotifications } from "../features/Notification";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlusCircle,
  FiUser,
  FiUsers,
  FiDollarSign,
  FiCalendar,
  FiClock,
  FiTrendingUp,
  FiTarget,
  FiActivity,
  FiPieChart,
  FiBarChart2,
  FiRefreshCw,
  FiUserPlus,
  FiX,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiArrowRight,
  FiList,
} from "react-icons/fi";
import ProfilePicture from "../components/ProfilePicture";
import { toast } from "react-hot-toast";
import axios from "axios";

function AdminDashboard() {
  const dispatch = useDispatch();
  const { students, studentStats } = useSelector((state) => state.Student);
  const { fees } = useSelector((state) => state.Fee);
  const { Timetables, isTimetablesLoading } = useSelector(
    (state) => state.Timetables
  );
  const { Authuser } = useSelector((state) => state.auth);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showStatsDetails, setShowStatsDetails] = useState(false);
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1234567890",
      subject: "Mathematics",
      status: "Active",
      gender: "male",
      joinDate: "2024-01-15",
      assignedClasses: [
        { id: "c1", name: "Class 10 - Mathematics", schedule: "MWF 9:00 AM" },
        { id: "c2", name: "Class 11 - Mathematics", schedule: "TTh 11:00 AM" },
      ],
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1987654321",
      subject: "Physics",
      status: "Active",
      gender: "female",
      joinDate: "2024-02-01",
      assignedClasses: [
        { id: "c3", name: "Class 10 - Physics", schedule: "MWF 10:00 AM" },
        { id: "c4", name: "Class 12 - Physics", schedule: "TTh 2:00 PM" },
      ],
    },
    {
      id: 3,
      name: "Michael Johnson",
      email: "michael.j@example.com",
      phone: "+1122334455",
      subject: "Chemistry",
      status: "On Leave",
      gender: "male",
      joinDate: "2024-01-20",
      assignedClasses: [
        { id: "c5", name: "Class 11 - Chemistry", schedule: "MWF 1:00 PM" },
      ],
    },
  ]);
  const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    address: "",
    gender: "",
    qualification: "",
    experience: "",
    assignedClasses: [],
  });
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [tempAssignedClasses, setTempAssignedClasses] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [viewingTeacher, setViewingTeacher] = useState(null);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isViewStudentModalOpen, setIsViewStudentModalOpen] = useState(false);
  const [isEditStudentModalOpen, setIsEditStudentModalOpen] = useState(false);
  const [isDeleteStudentModalOpen, setIsDeleteStudentModalOpen] =
    useState(false);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    grade: "",
    parentName: "",
    parentPhone: "",
    enrollmentDate: new Date().toISOString().split("T")[0],
    status: "Active",
  });

  const qualificationOptions = [
    { value: "", label: "Select Qualification" },
    { value: "bachelors", label: "Bachelor's Degree" },
    { value: "masters", label: "Master's Degree" },
    { value: "phd", label: "PhD" },
    { value: "diploma", label: "Diploma" },
  ];

  const genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const gradeOptions = [
    { value: "", label: "Select Grade" },
    { value: "grade10", label: "Grade 10" },
    { value: "grade11", label: "Grade 11" },
    { value: "grade12", label: "Grade 12" },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

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

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: { duration: 1, repeat: Infinity, repeatType: "reverse" },
    },
  };

  // Add available classes data
  const availableClasses = [
    {
      id: "c1",
      name: "Class 10 - Mathematics",
      schedule: "MWF 9:00 AM",
      subject: "Mathematics",
    },
    {
      id: "c2",
      name: "Class 11 - Mathematics",
      schedule: "TTh 11:00 AM",
      subject: "Mathematics",
    },
    {
      id: "c3",
      name: "Class 10 - Physics",
      schedule: "MWF 10:00 AM",
      subject: "Physics",
    },
    {
      id: "c4",
      name: "Class 12 - Physics",
      schedule: "TTh 2:00 PM",
      subject: "Physics",
    },
    {
      id: "c5",
      name: "Class 11 - Chemistry",
      schedule: "MWF 1:00 PM",
      subject: "Chemistry",
    },
    {
      id: "c6",
      name: "Class 12 - Chemistry",
      schedule: "TTh 3:00 PM",
      subject: "Chemistry",
    },
    {
      id: "c7",
      name: "Class 10 - Biology",
      schedule: "MWF 11:00 AM",
      subject: "Biology",
    },
    {
      id: "c8",
      name: "Class 11 - Biology",
      schedule: "TTh 1:00 PM",
      subject: "Biology",
    },
  ];

  const handleClassAssignment = (classId) => {
    const selectedClass = availableClasses.find((cls) => cls.id === classId);
    if (!selectedClass) return;

    const isAlreadyAssigned = tempAssignedClasses.some(
      (cls) => cls.id === classId
    );

    if (isAlreadyAssigned) {
      setTempAssignedClasses(
        tempAssignedClasses.filter((cls) => cls.id !== classId)
      );
    } else {
      setTempAssignedClasses([...tempAssignedClasses, selectedClass]);
    }
  };

  const handleAssignClasses = (teacher) => {
    setSelectedTeacher(teacher);
    setTempAssignedClasses(teacher.assignedClasses);
    setIsAssignModalOpen(true);
  };

  const handleSaveAssignments = () => {
    if (selectedTeacher) {
      setTeachers(
        teachers.map((teacher) =>
          teacher.id === selectedTeacher.id
            ? { ...teacher, assignedClasses: tempAssignedClasses }
            : teacher
        )
      );
      setIsAssignModalOpen(false);
      setSelectedTeacher(null);
      setTempAssignedClasses([]);
      toast.success("Classes assigned successfully!");
    }
  };

  // Filter available classes based on selected teacher's subject
  const getFilteredClasses = () => {
    if (!selectedTeacher) return [];
    return availableClasses.filter(
      (cls) => cls.subject === selectedTeacher.subject
    );
  };

  useEffect(() => {
    dispatch(fetchAllStudents());
    dispatch(fetchAllFees());
    dispatch(fetchAllTimetables());
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    if (students.length > 0) {
      dispatch(calculateStudentStats());
    }
  }, [students, dispatch]);

  // Calculate fees stats
  const totalFees = fees?.reduce((sum, fee) => sum + fee.amount, 0) || 0;
  const paidFees =
    fees
      ?.filter((fee) => fee.paidStatus)
      .reduce((sum, fee) => sum + fee.amount, 0) || 0;
  const unpaidFees = totalFees - paidFees;
  const paidPercentage =
    totalFees > 0 ? Math.round((paidFees / totalFees) * 100) : 0;

  // Get upcoming events from timetable (next 3 days)
  const today = new Date();
  const threeDaysLater = new Date(today);
  threeDaysLater.setDate(today.getDate() + 3);

  const upcomingEvents =
    Timetables?.filter((event) => {
      const eventDate = new Date(event.startTime);
      return eventDate >= today && eventDate <= threeDaysLater;
    })
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      .slice(0, 5) || [];

  // Format date for timetable events
  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get current time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Calculate days since last login
  const getLastLogin = () => {
    if (!Authuser?.lastLogin) return "First time login";
    const lastLogin = new Date(Authuser.lastLogin);
    const today = new Date();
    const diffTime = Math.abs(today - lastLogin);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0
      ? "Today"
      : diffDays === 1
      ? "Yesterday"
      : `${diffDays} days ago`;
  };

  // Handle refresh data
  const handleRefreshData = () => {
    setIsRefreshing(true);
    Promise.all([
      dispatch(fetchAllStudents()),
      dispatch(fetchAllFees()),
      dispatch(fetchAllTimetables()),
    ]).finally(() => {
      setTimeout(() => setIsRefreshing(false), 1000);
    });
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const teacherData = {
        Firstname: `${newTeacher.firstName}`,
        Lastname: `${newTeacher.lastName}`,
        email: newTeacher.email,
        phone: newTeacher.phone,
        subject: newTeacher.subject,
        address: newTeacher.address,
        dateOfBirth: newTeacher.birthdate,
        gender: newTeacher.gender,
        qualification: newTeacher.qualification,
        status: "Active",
        joinDate: new Date().toISOString(),
        assignedClasses: newTeacher.assignedClasses,
      };

      const teacher = {
        id: teachers.length + 1,
        name: `${newTeacher.firstName} ${newTeacher.lastName}`,
        email: newTeacher.email,
        phone: newTeacher.phone,
        subject: newTeacher.subject,
        address: newTeacher.address,
        gender: newTeacher.gender,
        qualification: newTeacher.qualification,
        status: "Active",
        joinDate: new Date().toISOString(),
        assignedClasses: newTeacher.assignedClasses,
      };

      dispatch(AddTeacher(teacherData))
        .unwrap()
        .then(() => {
          window.location.reload();
        })
        .catch((error) => {
          toast.error(error || "Failed to add student");
        });

      setTeachers([...teachers, teacher]);
      setIsAddTeacherModalOpen(false);
      setNewTeacher({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        address: "",
        gender: "",
        qualification: "",
        experience: "",
        assignedClasses: [],
      });

      toast.success("Teacher added successfully!");
    } catch (error) {
      toast.error("Failed to add teacher. Please try again.");
    }
  };

  const handleViewTeacher = (teacher) => {
    setViewingTeacher(teacher);
    setIsViewModalOpen(true);
  };

  const handleEditTeacher = (teacher) => {
    setEditingTeacher({
      ...teacher,
      firstName: teacher.name.split(" ")[0],
      lastName: teacher.name.split(" ").slice(1).join(" "),
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteTeacher = (teacher) => {
    setViewingTeacher(teacher);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateTeacher = async (e) => {
    e.preventDefault();
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setTeachers(
        teachers.map((teacher) =>
          teacher.id === editingTeacher.id
            ? {
                ...teacher,
                name: `${editingTeacher.firstName} ${editingTeacher.lastName}`,
                email: editingTeacher.email,
                phone: editingTeacher.phone,
                subject: editingTeacher.subject,
                gender: editingTeacher.gender,
                address: editingTeacher.address,
                qualification: editingTeacher.qualification,
                experience: editingTeacher.experience,
              }
            : teacher
        )
      );

      setIsEditModalOpen(false);
      setEditingTeacher(null);
      toast.success("Teacher updated successfully!");
    } catch (error) {
      toast.error("Failed to update teacher. Please try again.");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setTeachers(
        teachers.filter((teacher) => teacher.id !== viewingTeacher.id)
      );
      setIsDeleteModalOpen(false);
      setViewingTeacher(null);
      toast.success("Teacher deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete teacher. Please try again.");
    }
  };

  const handleViewStudent = (student) => {
    setViewingStudent(student);
    setIsViewStudentModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent({
      ...student,
      firstName: student.firstName,
      lastName: student.lastName,
    });
    setIsEditStudentModalOpen(true);
  };

  const handleDeleteStudent = (student) => {
    setViewingStudent(student);
    setIsDeleteStudentModalOpen(true);
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const student = {
        id: students.length + 1,
        ...newStudent,
        status: "Active",
        enrollmentDate: new Date().toISOString(),
      };

      dispatch({ type: "student/addStudent", payload: student });
      setIsAddStudentModalOpen(false);
      setNewStudent({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "",
        address: "",
        grade: "",
        parentName: "",
        parentPhone: "",
        enrollmentDate: new Date().toISOString().split("T")[0],
        status: "Active",
      });

      toast.success("Student added successfully!");
    } catch (error) {
      toast.error("Failed to add student. Please try again.");
    }
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      dispatch({
        type: "student/updateStudent",
        payload: {
          id: editingStudent.id,
          ...editingStudent,
        },
      });

      setIsEditStudentModalOpen(false);
      setEditingStudent(null);
      toast.success("Student updated successfully!");
    } catch (error) {
      toast.error("Failed to update student. Please try again.");
    }
  };

  const handleConfirmDeleteStudent = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      dispatch({
        type: "student/deleteStudent",
        payload: viewingStudent.id,
      });

      setIsDeleteStudentModalOpen(false);
      setViewingStudent(null);
      toast.success("Student deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete student. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <TopNavbar />

      {/* Main Dashboard Container */}
      <motion.div
        className="p-2 md:p-3 lg:p-4 mt-2 max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Message */}
        <motion.div
          className="mb-4 md:mb-6 overflow-hidden rounded-xl shadow-lg"
          variants={itemVariants}
        >
          <div className="relative bg-gradient-to-r from-indigo-600 via-blue-700 to-purple-700 px-6 py-4">
            <div className="absolute top-0 right-0 w-full h-full opacity-10">
              <svg
                className="w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path d="M0,0 L100,0 L100,100 Z" fill="white" />
              </svg>
            </div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="mb-3 md:mb-0">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-1">
                  {getGreeting()}, {Authuser?.firstName || "Admin"}
                </h2>
                <p className="text-sm">
                  Welcome to your dashboard. Here's an overview of your school.
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 sm:p-3 w-full md:w-auto">
                <p className="font-medium text-sm">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <div className="mt-1 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></span>
                  <p className="text-xs text-sm">
                    Last login: {getLastLogin()}
                  </p>
                </div>
              </div>
            </div>
            <div className="relative z-10 mt-3">
              <button
                onClick={handleRefreshData}
                className="flex items-center bg-gray-200 text-black px-3 py-1.5 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                disabled={isRefreshing}
              >
                <FiRefreshCw
                  className={`mr-2 ${isRefreshing ? "animate-spin" : ""}`}
                />
                {isRefreshing ? "Refreshing..." : "Refresh Data"}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {/* Student Stats */}
          <motion.div
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
            variants={itemVariants}
            whileHover={{ y: -5 }}
            onClick={() => setShowStatsDetails(!showStatsDetails)}
          >
            <div className="p-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-blue-100 mr-4">
                  <FiUsers className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm font-medium text-black">
                    Total Students
                  </p>
                  <p className="text-3xl font-bold text-black">
                    {studentStats.total || 0}
                  </p>
                </div>
              </div>

              <motion.div
                animate={
                  showStatsDetails
                    ? { height: "auto", opacity: 1 }
                    : { height: 0, opacity: 0 }
                }
                initial={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-4"
              >
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium mb-2 text-black">
                    Student Distribution
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm text-black">
                        <span>Active</span>
                        <span>
                          {studentStats.active || 0} (
                          {studentStats.total
                            ? Math.round(
                                (studentStats.active / studentStats.total) * 100
                              )
                            : 0}
                          %)
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full mt-1">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{
                            width: `${
                              studentStats.total
                                ? (studentStats.active / studentStats.total) *
                                  100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-black">
                        <span>Suspended</span>
                        <span>
                          {studentStats.suspended || 0} (
                          {studentStats.total
                            ? Math.round(
                                (studentStats.suspended / studentStats.total) *
                                  100
                              )
                            : 0}
                          %)
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full mt-1">
                        <div
                          className="h-full bg-red-500 rounded-full"
                          style={{
                            width: `${
                              studentStats.total
                                ? (studentStats.suspended /
                                    studentStats.total) *
                                  100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-black">
                        <span>Graduated</span>
                        <span>
                          {studentStats.graduated || 0} (
                          {studentStats.total
                            ? Math.round(
                                (studentStats.graduated / studentStats.total) *
                                  100
                              )
                            : 0}
                          %)
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full mt-1">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{
                            width: `${
                              studentStats.total
                                ? (studentStats.graduated /
                                    studentStats.total) *
                                  100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="flex justify-between mt-4 bg-gray-50 -mx-6 px-6 py-3 border-t">
                <div>
                  <span className="font-semibold">
                    {studentStats.active || 0}
                  </span>
                  <span className="text-sm ml-1">Active</span>
                </div>
                <div>
                  <span className="font-semibold">
                    {studentStats.suspended || 0}
                  </span>
                  <span className="text-sm ml-1">Suspended</span>
                </div>
                <div>
                  <span className="font-semibold">
                    {studentStats.graduated || 0}
                  </span>
                  <span className="text-sm ml-1">Graduated</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Fee Stats */}
          <motion.div
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="p-1 bg-gradient-to-r from-green-500 to-emerald-600"></div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-green-100 mr-4">
                  <FiDollarSign className="text-green-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm font-medium text-black">Total Fees</p>
                  <p className="text-3xl font-bold text-black">
                    $
                    {totalFees.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>

              <div className="mt-4 mb-2">
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Payment Progress</span>
                  <span className="font-medium">{paidPercentage}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${paidPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  ></motion.div>
                </div>
              </div>

              <div className="flex justify-between bg-gray-50 -mx-6 px-6 py-3 border-t">
                <div>
                  <span className="font-semibold">
                    $
                    {paidFees.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <p className="text-sm">Paid</p>
                </div>
                <div className="text-right">
                  <span className="font-semibold">
                    $
                    {unpaidFees.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <p className="text-sm">Unpaid</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Teachers Count Card */}
          <motion.div
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="p-1 bg-gradient-to-r from-indigo-500 to-blue-600"></div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-indigo-100 mr-4">
                  <FiUsers className="text-indigo-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm font-medium text-black">
                    Total Teachers
                  </p>
                  <p className="text-3xl font-bold text-black">
                    {teachers.length}
                  </p>
                </div>
              </div>
              <div className="flex justify-between mt-4 bg-gray-50 -mx-6 px-6 py-3 border-t">
                <span className="font-semibold">{teachers.length}</span>
                <span className="text-sm ml-1">Available</span>
              </div>
            </div>
          </motion.div>

          {/* Classes/Timetable Overview */}
          <motion.div
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="p-1 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-purple-100 mr-4">
                  <FiCalendar className="text-purple-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm font-medium text-black">
                    Scheduled Events
                  </p>
                  <div className="flex items-baseline">
                    <p className="text-3xl font-bold text-black">
                      {Timetables?.length || 0}
                    </p>
                    <p className="text-sm ml-1">total</p>
                  </div>
                </div>
              </div>

              {upcomingEvents.length > 0 ? (
                <div className="mt-4">
                  <motion.div
                    className="bg-purple-50 p-2 rounded-lg mb-2"
                    variants={pulseVariants}
                    animate="pulse"
                  >
                    <p className="text-sm font-medium text-black">
                      Next: {formatEventDate(upcomingEvents[0].startTime)}
                    </p>
                    <p className="font-medium truncate text-black">
                      {upcomingEvents[0].title}
                    </p>
                  </motion.div>
                  {upcomingEvents.length > 1 && (
                    <p className="text-sm mt-1">
                      +{upcomingEvents.length - 1} more events scheduled soon
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-4 bg-gray-50 p-2 rounded-lg">
                  <p className="text-sm text-black">No upcoming events</p>
                </div>
              )}

              <div className="flex justify-center bg-gray-50 -mx-6 px-6 py-3 border-t mt-3">
                <Link
                  to="/Admin/Timetable"
                  className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center transition-colors"
                >
                  <FiClock className="mr-1" /> View Full Schedule
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Students */}
          <motion.div
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden lg:col-span-2"
            variants={itemVariants}
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg flex items-center">
                  <FiUsers className="mr-2 text-blue-600" /> Recent Students
                </h3>
                <Link
                  to="/Admin/students"
                  className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
                >
                  View All <FiPlusCircle className="ml-1" />
                </Link>
              </div>
            </div>

            <div className="p-6">
              {students.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {students.slice(0, 5).map((student, index) => (
                    <motion.div
                      key={student._id}
                      className="flex items-center py-4 first:pt-0 last:pb-0"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{
                        backgroundColor: "rgba(243, 244, 246, 0.6)",
                      }}
                    >
                      <div className="mr-4 flex-shrink-0 w-12 h-12 border-2 border-gray-200 rounded-full overflow-hidden">
                        <ProfilePicture
                          profilePic={student.profileImage}
                          firstName={student.firstName}
                          size="small"
                          editable={false}
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium text-black">
                          {student.firstName} {student.lastName}
                        </h4>
                        <div className="flex items-center gap-4">
                          <p className="text-sm text-black">{student.email}</p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              student.status === "active"
                                ? "bg-green-100"
                                : student.status === "suspended"
                                ? "bg-red-100"
                                : "bg-blue-100"
                            }`}
                          >
                            {student.status || "Active"}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {/* Details button removed as requested */}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg
                    className="w-12 h-12 text-black mx-auto mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <p className="text-black">No students found</p>
                  <Link
                    to="/Admin/students"
                    className="mt-2 inline-block text-blue-600 hover:text-blue-800"
                  >
                    Add Students
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Upcoming Events/Timetable */}
          <motion.div
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
            variants={itemVariants}
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg flex items-center">
                  <FiCalendar className="mr-2 text-purple-600" /> Upcoming
                  Events
                </h3>
                <Link
                  to="/Admin/Timetable"
                  className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
                >
                  View Calendar <FiCalendar className="ml-1" />
                </Link>
              </div>
            </div>

            <div className="p-6">
              {upcomingEvents.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {upcomingEvents.map((event, index) => (
                    <motion.div
                      key={event._id}
                      className="py-4 first:pt-0 last:pb-0"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 3 }}
                    >
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <FiClock className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-black">
                            {event.title}
                          </p>
                          <p className="text-sm text-black">
                            {formatEventDate(event.startTime)}
                          </p>
                        </div>
                      </div>
                      {event.description && (
                        <p className="text-sm ml-13 pl-10">
                          {event.description.length > 100
                            ? `${event.description.substring(0, 100)}...`
                            : event.description}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg
                    className="w-12 h-12 text-black mx-auto mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-black">No upcoming events</p>
                  <Link
                    to="/Admin/Timetable"
                    className="mt-2 inline-block text-blue-600 hover:text-blue-800"
                  >
                    Schedule Events
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Teachers and Students Sections */}
        <div className="mt-8 mr-8">
          {/* Teachers List Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 p-6">
            <div className="border-b border-gray-200 flex justify-between items-center pb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Registered Teachers
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {teachers.length} teachers registered
                </p>
              </div>
              <button
                onClick={() => setIsAddTeacherModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiUserPlus className="mr-2" />
                Add Teacher
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                {/* Teachers List Table Header */}
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned Classes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {teacher.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {teacher.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {teacher.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {teacher.subject}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 capitalize">
                          {teacher.gender}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {teacher.assignedClasses.map((cls) => (
                            <div key={cls.id} className="text-sm">
                              <span className="text-gray-900">{cls.name}</span>
                              <span className="text-gray-500 text-xs block">
                                {cls.schedule}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => handleViewTeacher(teacher)}
                            className="text-blue-600 hover:text-blue-900 flex items-center px-2 py-1 rounded hover:bg-blue-50"
                            title="View Details"
                          >
                            <FiUser className="w-4 h-4 mr-1" />
                            View
                          </button>
                          <button
                            onClick={() => handleEditTeacher(teacher)}
                            className="text-indigo-600 hover:text-indigo-900 flex items-center px-2 py-1 rounded hover:bg-indigo-50"
                            title="Edit Teacher"
                          >
                            <FiActivity className="w-4 h-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleAssignClasses(teacher)}
                            className="text-green-600 hover:text-green-900 flex items-center px-2 py-1 rounded hover:bg-green-50"
                            title="Assign Classes"
                          >
                            <FiList className="w-4 h-4 mr-1" />
                            Assign
                          </button>
                          <button
                            onClick={() => handleDeleteTeacher(teacher)}
                            className="text-red-600 hover:text-red-900 flex items-center px-2 py-1 rounded hover:bg-red-50"
                            title="Delete Teacher"
                          >
                            <FiXCircle className="w-4 h-4 mr-1" />
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

          {/* Registered Students Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Registered Students
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {students.length} students registered
                </p>
              </div>
              <button
                onClick={() => setIsAddStudentModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiUserPlus className="mr-2" />
                Add Student
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                {/* Students List Table Header */}
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parent Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {student.firstName[0]}
                                {student.lastName[0]}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.firstName} {student.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {student.grade}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {student.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 capitalize">
                          {student.gender}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-gray-900">
                            {student.parentName}
                          </div>
                          <div className="text-gray-500">
                            {student.parentPhone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewStudent(student)}
                            className="text-blue-600 hover:text-blue-900 flex items-center px-2 py-1 rounded hover:bg-blue-50"
                            title="View Details"
                          >
                            <FiUser className="w-4 h-4 mr-1" />
                            View
                          </button>
                          <button
                            onClick={() => handleEditStudent(student)}
                            className="text-indigo-600 hover:text-indigo-900 flex items-center px-2 py-1 rounded hover:bg-indigo-50"
                            title="Edit Student"
                          >
                            <FiActivity className="w-4 h-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student)}
                            className="text-red-600 hover:text-red-900 flex items-center px-2 py-1 rounded hover:bg-red-50"
                            title="Delete Student"
                          >
                            <FiXCircle className="w-4 h-4 mr-1" />
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
        </div>
      </motion.div>

      {/* Add Teacher Modal */}
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
                    Add New Teacher
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
                      First Name
                    </label>
                    <input
                      type="text"
                      value={newTeacher.firstName}
                      onChange={(e) =>
                        setNewTeacher({
                          ...newTeacher,
                          firstName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={newTeacher.lastName}
                      onChange={(e) =>
                        setNewTeacher({
                          ...newTeacher,
                          lastName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newTeacher.email}
                      onChange={(e) =>
                        setNewTeacher({ ...newTeacher, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={newTeacher.phone}
                      onChange={(e) =>
                        setNewTeacher({ ...newTeacher, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={newTeacher.subject}
                      onChange={(e) => {
                        setNewTeacher({
                          ...newTeacher,
                          subject: e.target.value,
                          assignedClasses: [], // Clear assigned classes when subject changes
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      value={newTeacher.gender}
                      onChange={(e) =>
                        setNewTeacher({ ...newTeacher, gender: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      {genderOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      value={newTeacher.address}
                      onChange={(e) =>
                        setNewTeacher({
                          ...newTeacher,
                          address: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Birthdate
                    </label>
                    <input
                      type="date"
                      value={newTeacher.birthdate}
                      onChange={(e) =>
                        setNewTeacher({
                          ...newTeacher,
                          birthdate: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qualification
                    </label>
                    <select
                      value={newTeacher.qualification}
                      onChange={(e) =>
                        setNewTeacher({
                          ...newTeacher,
                          qualification: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      {qualificationOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience
                    </label>
                    <input
                      type="text"
                      value={newTeacher.experience}
                      onChange={(e) =>
                        setNewTeacher({
                          ...newTeacher,
                          experience: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 5 years"
                      required
                    />
                  </div>
                  {/* Class Assignment Section */}
                  <div className="md:col-span-2">
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Assign Classes
                      </h3>

                      {newTeacher.subject ? (
                        <div className="space-y-4">
                          <p className="text-sm text-gray-600">
                            Available classes for {newTeacher.subject}:
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {getFilteredClasses().map((cls) => (
                              <div
                                key={cls.id}
                                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                  newTeacher.assignedClasses.some(
                                    (ac) => ac.id === cls.id
                                  )
                                    ? "bg-blue-50 border-blue-200"
                                    : "bg-white border-gray-200 hover:bg-gray-50"
                                }`}
                                onClick={() => handleClassAssignment(cls.id)}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-medium text-gray-900">
                                      {cls.name}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                      {cls.schedule}
                                    </p>
                                  </div>
                                  <div
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                      newTeacher.assignedClasses.some(
                                        (ac) => ac.id === cls.id
                                      )
                                        ? "bg-blue-500 border-blue-500"
                                        : "border-gray-300"
                                    }`}
                                  >
                                    {newTeacher.assignedClasses.some(
                                      (ac) => ac.id === cls.id
                                    ) && (
                                      <FiCheckCircle className="w-4 h-4 text-white" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          {getFilteredClasses().length === 0 && (
                            <p className="text-sm text-gray-500 italic">
                              No classes available for {newTeacher.subject}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          Please select a subject to view available classes
                        </p>
                      )}

                      {newTeacher.assignedClasses.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            Selected Classes (
                            {newTeacher.assignedClasses.length})
                          </h4>
                          <div className="space-y-2">
                            {newTeacher.assignedClasses.map((cls) => (
                              <div
                                key={cls.id}
                                className="flex items-center justify-between p-2 bg-white rounded border border-gray-200"
                              >
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {cls.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {cls.schedule}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleClassAssignment(cls.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <FiX className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
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
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add Teacher
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Teacher Modal */}
      <AnimatePresence>
        {isViewModalOpen && viewingTeacher && (
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
                    Teacher Details
                  </h2>
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      setViewingTeacher(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Name
                      </h3>
                      <p className="mt-1 text-lg text-gray-900">
                        {viewingTeacher.name}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Email
                      </h3>
                      <p className="mt-1 text-gray-900">
                        {viewingTeacher.email}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Phone
                      </h3>
                      <p className="mt-1 text-gray-900">
                        {viewingTeacher.phone}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Subject
                      </h3>
                      <p className="mt-1 text-gray-900">
                        {viewingTeacher.subject}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Gender
                      </h3>
                      <p className="mt-1 text-gray-900 capitalize">
                        {viewingTeacher.gender}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Address
                      </h3>
                      <p className="mt-1 text-gray-900">
                        {viewingTeacher.address}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Qualification
                      </h3>
                      <p className="mt-1 text-gray-900 capitalize">
                        {viewingTeacher.qualification}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Experience
                      </h3>
                      <p className="mt-1 text-gray-900">
                        {viewingTeacher.experience}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Assigned Classes
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {viewingTeacher.assignedClasses.map((cls) => (
                      <div
                        key={cls.id}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <p className="font-medium text-gray-900">{cls.name}</p>
                        <p className="text-sm text-gray-500">{cls.schedule}</p>
                      </div>
                    ))}
                    {viewingTeacher.assignedClasses.length === 0 && (
                      <p className="text-sm text-gray-500 italic">
                        No classes assigned
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setIsViewModalOpen(false);
                      setViewingTeacher(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Teacher Modal */}
      <AnimatePresence>
        {isEditModalOpen && editingTeacher && (
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
                    Edit Teacher
                  </h2>
                  <button
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setEditingTeacher(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleUpdateTeacher} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={editingTeacher.firstName}
                      onChange={(e) =>
                        setEditingTeacher({
                          ...editingTeacher,
                          firstName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={editingTeacher.lastName}
                      onChange={(e) =>
                        setEditingTeacher({
                          ...editingTeacher,
                          lastName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editingTeacher.email}
                      onChange={(e) =>
                        setEditingTeacher({
                          ...editingTeacher,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={editingTeacher.phone}
                      onChange={(e) =>
                        setEditingTeacher({
                          ...editingTeacher,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={editingTeacher.subject}
                      onChange={(e) =>
                        setEditingTeacher({
                          ...editingTeacher,
                          subject: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      value={editingTeacher.gender}
                      onChange={(e) =>
                        setEditingTeacher({
                          ...editingTeacher,
                          gender: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      {genderOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      value={editingTeacher.address}
                      onChange={(e) =>
                        setEditingTeacher({
                          ...editingTeacher,
                          address: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qualification
                    </label>
                    <select
                      value={editingTeacher.qualification}
                      onChange={(e) =>
                        setEditingTeacher({
                          ...editingTeacher,
                          qualification: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      {qualificationOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience
                    </label>
                    <input
                      type="text"
                      value={editingTeacher.experience}
                      onChange={(e) =>
                        setEditingTeacher({
                          ...editingTeacher,
                          experience: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 5 years"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setEditingTeacher(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Update Teacher
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && viewingTeacher && (
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
              className="bg-white rounded-xl shadow-xl max-w-md w-full"
            >
              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="rounded-full bg-red-100 p-3">
                    <FiAlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                  Delete Teacher
                </h3>
                <p className="text-sm text-gray-500 text-center mb-6">
                  Are you sure you want to delete {viewingTeacher.name}? This
                  action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                      setViewingTeacher(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assign Classes Modal */}
      <AnimatePresence>
        {isAssignModalOpen && selectedTeacher && (
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
                    Assign Classes to {selectedTeacher.name}
                  </h2>
                  <button
                    onClick={() => {
                      setIsAssignModalOpen(false);
                      setSelectedTeacher(null);
                      setTempAssignedClasses([]);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Subject: {selectedTeacher.subject}
                </p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Available Classes */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Available Classes
                    </h3>
                    <div className="space-y-2">
                      {getFilteredClasses().map((cls) => (
                        <div
                          key={cls.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            tempAssignedClasses.some((ac) => ac.id === cls.id)
                              ? "bg-blue-50 border-blue-200"
                              : "bg-white border-gray-200 hover:bg-gray-50"
                          }`}
                          onClick={() => handleClassAssignment(cls.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {cls.name}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {cls.schedule}
                              </p>
                            </div>
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                tempAssignedClasses.some(
                                  (ac) => ac.id === cls.id
                                )
                                  ? "bg-blue-500 border-blue-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {tempAssignedClasses.some(
                                (ac) => ac.id === cls.id
                              ) && (
                                <FiCheckCircle className="w-4 h-4 text-white" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {getFilteredClasses().length === 0 && (
                        <p className="text-sm text-gray-500 italic">
                          No classes available for {selectedTeacher.subject}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Selected Classes */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Selected Classes ({tempAssignedClasses.length})
                    </h3>
                    <div className="space-y-2">
                      {tempAssignedClasses.map((cls) => (
                        <div
                          key={cls.id}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {cls.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {cls.schedule}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleClassAssignment(cls.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {tempAssignedClasses.length === 0 && (
                        <p className="text-sm text-gray-500 italic">
                          No classes selected
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAssignModalOpen(false);
                      setSelectedTeacher(null);
                      setTempAssignedClasses([]);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveAssignments}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Assignments
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Student Modal */}
      <AnimatePresence>
        {isAddStudentModalOpen && (
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
                    Add New Student
                  </h2>
                  <button
                    onClick={() => setIsAddStudentModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddStudent} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={newStudent.firstName}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          firstName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={newStudent.lastName}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          lastName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newStudent.email}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={newStudent.phone}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade
                    </label>
                    <select
                      value={newStudent.grade}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, grade: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      {gradeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      value={newStudent.gender}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, gender: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      {genderOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      value={newStudent.address}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          address: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parent/Guardian Name
                    </label>
                    <input
                      type="text"
                      value={newStudent.parentName}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          parentName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parent/Guardian Phone
                    </label>
                    <input
                      type="tel"
                      value={newStudent.parentPhone}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          parentPhone: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsAddStudentModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add Student
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Student Modal */}
      <AnimatePresence>
        {isViewStudentModalOpen && viewingStudent && (
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
                    Student Details
                  </h2>
                  <button
                    onClick={() => {
                      setIsViewStudentModalOpen(false);
                      setViewingStudent(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Name
                      </h3>
                      <p className="mt-1 text-lg text-gray-900">
                        {viewingStudent.firstName} {viewingStudent.lastName}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Email
                      </h3>
                      <p className="mt-1 text-gray-900">
                        {viewingStudent.email}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Phone
                      </h3>
                      <p className="mt-1 text-gray-900">
                        {viewingStudent.phone}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Grade
                      </h3>
                      <p className="mt-1 text-gray-900">
                        {viewingStudent.grade}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Gender
                      </h3>
                      <p className="mt-1 text-gray-900 capitalize">
                        {viewingStudent.gender}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Address
                      </h3>
                      <p className="mt-1 text-gray-900">
                        {viewingStudent.address}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Parent/Guardian Name
                      </h3>
                      <p className="mt-1 text-gray-900">
                        {viewingStudent.parentName}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Parent/Guardian Phone
                      </h3>
                      <p className="mt-1 text-gray-900">
                        {viewingStudent.parentPhone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setIsViewStudentModalOpen(false);
                      setViewingStudent(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Student Modal */}
      <AnimatePresence>
        {isEditStudentModalOpen && editingStudent && (
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
                    Edit Student
                  </h2>
                  <button
                    onClick={() => {
                      setIsEditStudentModalOpen(false);
                      setEditingStudent(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleUpdateStudent} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={editingStudent.firstName}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          firstName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={editingStudent.lastName}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          lastName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editingStudent.email}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={editingStudent.phone}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade
                    </label>
                    <select
                      value={editingStudent.grade}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          grade: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      {gradeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      value={editingStudent.gender}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          gender: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      {genderOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      value={editingStudent.address}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          address: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parent/Guardian Name
                    </label>
                    <input
                      type="text"
                      value={editingStudent.parentName}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          parentName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parent/Guardian Phone
                    </label>
                    <input
                      type="tel"
                      value={editingStudent.parentPhone}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          parentPhone: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditStudentModalOpen(false);
                      setEditingStudent(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Update Student
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Student Confirmation Modal */}
      <AnimatePresence>
        {isDeleteStudentModalOpen && viewingStudent && (
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
              className="bg-white rounded-xl shadow-xl max-w-md w-full"
            >
              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="rounded-full bg-red-100 p-3">
                    <FiAlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                  Delete Student
                </h3>
                <p className="text-sm text-gray-500 text-center mb-6">
                  Are you sure you want to delete {viewingStudent.firstName}{" "}
                  {viewingStudent.lastName}? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDeleteStudentModalOpen(false);
                      setViewingStudent(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDeleteStudent}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminDashboard;
