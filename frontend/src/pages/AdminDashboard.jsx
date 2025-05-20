import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import TopNavbar from "../components/Topnavbar";
import { fetchAllStudents, calculateStudentStats } from "../features/Student";
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
  FiList
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
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      subject: 'Mathematics',
      status: 'Active',
      joinDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1987654321',
      subject: 'Physics',
      status: 'Active',
      joinDate: '2024-02-01'
    },
    {
      id: 3,
      name: 'Michael Johnson',
      email: 'michael.j@example.com',
      phone: '+1122334455',
      subject: 'Chemistry',
      status: 'On Leave',
      joinDate: '2024-01-20'
    }
  ]);
  const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    qualification: '',
    experience: ''
  });
  const [pendingTeachers, setPendingTeachers] = useState([
    {
      _id: '1',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@school.edu',
      ProfilePic: 'https://randomuser.me/api/portraits/women/1.jpg',
      role: 'teacher',
      approvalStatus: 'pending',
      createdAt: '2024-03-15T10:30:00Z'
    },
    {
      _id: '2',
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@school.edu',
      ProfilePic: 'https://randomuser.me/api/portraits/men/2.jpg',
      role: 'teacher',
      approvalStatus: 'pending',
      createdAt: '2024-03-14T15:45:00Z'
    },
    {
      _id: '3',
      firstName: 'Emily',
      lastName: 'Rodriguez',
      email: 'emily.rodriguez@school.edu',
      ProfilePic: 'https://randomuser.me/api/portraits/women/3.jpg',
      role: 'teacher',
      approvalStatus: 'pending',
      createdAt: '2024-03-13T09:15:00Z'
    },
    {
      _id: '4',
      firstName: 'David',
      lastName: 'Kim',
      email: 'david.kim@school.edu',
      ProfilePic: 'https://randomuser.me/api/portraits/men/4.jpg',
      role: 'teacher',
      approvalStatus: 'pending',
      createdAt: '2024-03-12T14:20:00Z'
    },
    {
      _id: '5',
      firstName: 'Lisa',
      lastName: 'Patel',
      email: 'lisa.patel@school.edu',
      ProfilePic: 'https://randomuser.me/api/portraits/women/5.jpg',
      role: 'teacher',
      approvalStatus: 'pending',
      createdAt: '2024-03-11T11:10:00Z'
    }
  ]);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);
  const [isPendingTeachersModalOpen, setIsPendingTeachersModalOpen] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: { duration: 1, repeat: Infinity, repeatType: "reverse" }
    }
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
  const paidFees = fees?.filter(fee => fee.paidStatus).reduce((sum, fee) => sum + fee.amount, 0) || 0;
  const unpaidFees = totalFees - paidFees;
  const paidPercentage = totalFees > 0 ? Math.round((paidFees / totalFees) * 100) : 0;

  // Get upcoming events from timetable (next 3 days)
  const today = new Date();
  const threeDaysLater = new Date(today);
  threeDaysLater.setDate(today.getDate() + 3);
  
  const upcomingEvents = Timetables?.filter(event => {
    const eventDate = new Date(event.startTime);
    return eventDate >= today && eventDate <= threeDaysLater;
  }).sort((a, b) => new Date(a.startTime) - new Date(b.startTime)).slice(0, 5) || [];

  // Format date for timetable events
  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
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
    return diffDays === 0 ? "Today" : diffDays === 1 ? "Yesterday" : `${diffDays} days ago`;
  };

  // Handle refresh data
  const handleRefreshData = () => {
    setIsRefreshing(true);
    Promise.all([
      dispatch(fetchAllStudents()),
      dispatch(fetchAllFees()),
      dispatch(fetchAllTimetables())
    ]).finally(() => {
      setTimeout(() => setIsRefreshing(false), 1000);
    });
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    // Here you would typically make an API call to add the teacher
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add the new teacher to the list
      const teacher = {
        id: teachers.length + 1,
        name: `${newTeacher.firstName} ${newTeacher.lastName}`,
        email: newTeacher.email,
        phone: newTeacher.phone,
        subject: newTeacher.subject,
        status: 'Active',
        joinDate: new Date().toISOString()
      };
      
      setTeachers([...teachers, teacher]);
      setIsAddTeacherModalOpen(false);
      setNewTeacher({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        qualification: '',
        experience: ''
      });
      
      // Show success message
      toast.success('Teacher added successfully!');
    } catch (error) {
      toast.error('Failed to add teacher. Please try again.');
    }
  };

  // Modify the fetchPendingTeachers function to use mock data for testing
  useEffect(() => {
    const fetchPendingTeachers = async () => {
      setIsLoadingTeachers(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For testing, we'll use the mock data instead of making an API call
        // Comment out the actual API call for now
        /*
        const response = await axios.get('/api/auth/pending-teachers', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data && Array.isArray(response.data.teachers)) {
          setPendingTeachers(response.data.teachers);
          console.log('Successfully fetched pending teachers:', response.data.message);
        } else {
          console.error('Invalid response format:', response.data);
          setPendingTeachers([]);
          toast.error('Received invalid data format from server');
        }
        */
        
        // Using mock data for testing
        console.log('Using mock data for pending teachers');
        
      } catch (error) {
        console.error('Error fetching pending teachers:', error);
        setPendingTeachers([]);
        
        if (error.response) {
          switch (error.response.status) {
            case 401:
              toast.error('Please log in again to access this feature');
              break;
            case 403:
              toast.error('You do not have permission to view pending teachers');
              break;
            case 404:
              toast.error('No pending teachers found');
              break;
            default:
              toast.error(error.response.data?.error || 'Failed to fetch pending teachers');
          }
        } else if (error.request) {
          toast.error('No response from server. Please check your connection');
        } else {
          toast.error('Error fetching pending teachers: ' + error.message);
        }
      } finally {
        setIsLoadingTeachers(false);
      }
    };

    fetchPendingTeachers();
  }, []);

  // Add this function to handle teacher approval/rejection
  const handleTeacherAction = async (teacherId, action, rejectionReason = '') => {
    try {
      // First, get the teacher's details from our pending teachers list
      const teacher = pendingTeachers.find(t => t._id === teacherId);
      if (!teacher) {
        toast.error('Teacher not found');
        return;
      }

      // For testing, we'll simulate the API call and email notification
      setIsLoadingTeachers(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate API call
      const response = await axios.post('/api/auth/approve-teacher', {
        teacherId,
        action,
        rejectionReason,
        adminEmail: 'omermaruf07@gmail.com' // Add admin email for notification
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data) {
        // Update the pending teachers list
        setPendingTeachers(prev => prev.filter(t => t._id !== teacherId));
        
        // Show success message with email notification info
        const actionText = action === 'approve' ? 'approved' : 'rejected';
        toast.success(
          `Teacher ${actionText} successfully. Notification sent to ${teacher.email} and omermaruf07@gmail.com`,
          { duration: 5000 }
        );

        // Log the action for testing
        console.log(`Teacher ${actionText}:`, {
          teacherId,
          teacherEmail: teacher.email,
          adminEmail: 'omermaruf07@gmail.com',
          action,
          rejectionReason,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error(`Error ${action}ing teacher:`, error);
      
      // Handle specific error cases
      if (error.response) {
        switch (error.response.status) {
          case 401:
            toast.error('Please log in to perform this action');
            break;
          case 403:
            toast.error('You do not have permission to approve/reject teachers');
            break;
          case 404:
            toast.error('Teacher not found');
            break;
          default:
            toast.error(error.response.data?.error || `Failed to ${action} teacher`);
        }
      } else if (error.request) {
        toast.error('No response from server. Please check your connection.');
      } else {
        toast.error(`Error ${action}ing teacher: ${error.message}`);
      }
    } finally {
      setIsLoadingTeachers(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <TopNavbar />
      
      <motion.div 
        className="p-3 md:p-5 lg:p-6 mt-14"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Message */}
        <motion.div 
          className="mb-4 md:mb-6 overflow-hidden rounded-xl shadow-lg"
          variants={itemVariants}
        >
          <div className="relative bg-gradient-to-r from-indigo-600 via-blue-700 to-purple-700 p-3 sm:p-4 md:p-6">
            <div className="absolute top-0 right-0 w-full h-full opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,0 L100,0 L100,100 Z" fill="white"/>
              </svg>
            </div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="mb-3 md:mb-0">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-1">{getGreeting()}, {Authuser?.firstName || 'Admin'}</h2>
                <p className="text-sm">Welcome to your dashboard. Here's an overview of your school.</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 sm:p-3 w-full md:w-auto">
                <p className="font-medium text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <div className="mt-1 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></span>
                  <p className="text-xs text-sm">Last login: {getLastLogin()}</p>
                </div>
              </div>
            </div>
            <div className="relative z-10 mt-3">
              <button 
                onClick={handleRefreshData}
                className="flex items-center bg-gray-200 text-black px-3 py-1.5 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                disabled={isRefreshing}
              >
                <FiRefreshCw className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
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
                  <p className="text-sm font-medium text-black">Total Students</p>
                  <p className="text-3xl font-bold text-black">{studentStats.total || 0}</p>
                </div>
              </div>

              <motion.div 
                animate={showStatsDetails ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                initial={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-4"
              >
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium mb-2 text-black">Student Distribution</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm text-black">
                        <span>Active</span>
                        <span>{studentStats.active || 0} ({studentStats.total ? Math.round((studentStats.active / studentStats.total) * 100) : 0}%)</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full mt-1">
                        <div 
                          className="h-full bg-green-500 rounded-full" 
                          style={{ width: `${studentStats.total ? (studentStats.active / studentStats.total) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-black">
                        <span>Suspended</span>
                        <span>{studentStats.suspended || 0} ({studentStats.total ? Math.round((studentStats.suspended / studentStats.total) * 100) : 0}%)</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full mt-1">
                        <div 
                          className="h-full bg-red-500 rounded-full" 
                          style={{ width: `${studentStats.total ? (studentStats.suspended / studentStats.total) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-black">
                        <span>Graduated</span>
                        <span>{studentStats.graduated || 0} ({studentStats.total ? Math.round((studentStats.graduated / studentStats.total) * 100) : 0}%)</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full mt-1">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: `${studentStats.total ? (studentStats.graduated / studentStats.total) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <div className="flex justify-between mt-4 bg-gray-50 -mx-6 px-6 py-3 border-t">
                <div>
                  <span className="font-semibold">{studentStats.active || 0}</span>
                  <span className="text-sm ml-1">Active</span>
                </div>
                <div>
                  <span className="font-semibold">{studentStats.suspended || 0}</span>
                  <span className="text-sm ml-1">Suspended</span>
                </div>
                <div>
                  <span className="font-semibold">{studentStats.graduated || 0}</span>
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
                  <p className="text-3xl font-bold text-black">${totalFees.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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
                  <span className="font-semibold">${paidFees.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <p className="text-sm">Paid</p>
                </div>
                <div className="text-right">
                  <span className="font-semibold">${unpaidFees.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <p className="text-sm">Unpaid</p>
                </div>
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
                  <p className="text-sm font-medium text-black">Scheduled Events</p>
                  <div className="flex items-baseline">
                    <p className="text-3xl font-bold text-black">{Timetables?.length || 0}</p>
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
                    <p className="font-medium truncate text-black">{upcomingEvents[0].title}</p>
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
                <Link to="/Admin/Timetable" className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center transition-colors">
                  <FiClock className="mr-1" /> View Full Schedule
                </Link>
              </div>
            </div>
          </motion.div>
          
          {/* Pending Teachers Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-100 mr-4">
                  <FiAlertCircle className="text-orange-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Pending Teachers</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {isLoadingTeachers ? '...' : pendingTeachers?.length || 0}
                  </p>
                </div>
              </div>
            </div>
            
            {pendingTeachers?.length > 0 && (
              <button
                onClick={() => setIsPendingTeachersModalOpen(true)}
                className="w-full mt-4 px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors flex items-center justify-center"
              >
                <FiList className="mr-2" />
                View All Pending Requests
              </button>
            )}
          </motion.div>
        </div>
        
        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Pending Teachers Section */}
          {!isLoadingTeachers && pendingTeachers?.length > 0 && (
            <motion.div 
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden lg:col-span-2"
              variants={itemVariants}
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg flex items-center">
                    <FiAlertCircle className="mr-2 text-orange-600" /> Pending Teacher Approvals
                  </h3>
                  <Link to="/admin/teacher-requests" className="text-orange-600 hover:text-orange-800 flex items-center text-sm font-medium">
                    View All <FiPlusCircle className="ml-1" />
                  </Link>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {pendingTeachers.slice(0, 3).map((teacher) => (
                    <motion.div 
                      key={teacher._id}
                      className="flex items-center justify-between p-4 bg-orange-50 rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center">
                        <div className="mr-4">
                          <ProfilePicture
                            profilePic={teacher.ProfilePic}
                            firstName={teacher.firstName}
                            size="small"
                            editable={false}
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-black">
                            {teacher.firstName} {teacher.lastName}
                          </h4>
                          <p className="text-sm text-gray-600">{teacher.email}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleTeacherAction(teacher._id, 'approve')}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                          title="Approve"
                        >
                          <FiCheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleTeacherAction(teacher._id, 'reject')}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                          title="Reject"
                        >
                          <FiXCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          
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
                <Link to="/Admin/students" className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium">
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
                      whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.6)" }}
                      
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
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            student.status === 'active' ? 'bg-green-100' :
                            student.status === 'suspended' ? 'bg-red-100' :
                            'bg-blue-100'
                          }`}>
                            {student.status || 'Active'}
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
                  <svg className="w-12 h-12 text-black mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <p className="text-black">No students found</p>
                  <Link to="/Admin/students" className="mt-2 inline-block text-blue-600 hover:text-blue-800">
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
                  <FiCalendar className="mr-2 text-purple-600" /> Upcoming Events
                </h3>
                <Link to="/Admin/Timetable" className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium">
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
                          <p className="font-medium text-black">{event.title}</p>
                          <p className="text-sm text-black">{formatEventDate(event.startTime)}</p>
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
                  <svg className="w-12 h-12 text-black mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-black">No upcoming events</p>
                  <Link to="/Admin/Timetable" className="mt-2 inline-block text-blue-600 hover:text-blue-800">
                    Schedule Events
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Teachers List Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Registered Teachers</h2>
              <p className="text-sm text-gray-600 mt-1">{teachers.length} teachers registered</p>
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
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                              {teacher.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                          <div className="text-sm text-gray-500">{teacher.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{teacher.subject}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{teacher.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        teacher.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {teacher.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(teacher.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => navigate(`/admin/teacher/${teacher.id}`)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/admin/teacher/${teacher.id}/edit`)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                  <h2 className="text-xl font-semibold text-gray-800">Add New Teacher</h2>
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
                      onChange={(e) => setNewTeacher({...newTeacher, firstName: e.target.value})}
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
                      onChange={(e) => setNewTeacher({...newTeacher, lastName: e.target.value})}
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
                      onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
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
                      onChange={(e) => setNewTeacher({...newTeacher, phone: e.target.value})}
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
                      onChange={(e) => setNewTeacher({...newTeacher, subject: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qualification
                    </label>
                    <input
                      type="text"
                      value={newTeacher.qualification}
                      onChange={(e) => setNewTeacher({...newTeacher, qualification: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience
                    </label>
                    <input
                      type="text"
                      value={newTeacher.experience}
                      onChange={(e) => setNewTeacher({...newTeacher, experience: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Pending Teachers Modal */}
      <AnimatePresence>
        {isPendingTeachersModalOpen && (
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
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center">
                  <FiAlertCircle className="text-orange-600 text-xl mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">Pending Teacher Requests</h2>
                </div>
                <button
                  onClick={() => setIsPendingTeachersModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
                {isLoadingTeachers ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  </div>
                ) : pendingTeachers?.length > 0 ? (
                  <div className="space-y-4">
                    {pendingTeachers.map((teacher) => (
                      <motion.div
                        key={teacher._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={teacher.ProfilePic || 'https://via.placeholder.com/40'}
                            alt={`${teacher.firstName} ${teacher.lastName}`}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {teacher.firstName} {teacher.lastName}
                            </h4>
                            <p className="text-sm text-gray-600">{teacher.email}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Requested on {new Date(teacher.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              handleTeacherAction(teacher._id, 'approve');
                              setIsPendingTeachersModalOpen(false);
                            }}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
                          >
                            <FiCheckCircle className="mr-2" />
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              handleTeacherAction(teacher._id, 'reject');
                              setIsPendingTeachersModalOpen(false);
                            }}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
                          >
                            <FiXCircle className="mr-2" />
                            Reject
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FiAlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No pending teacher requests</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminDashboard;