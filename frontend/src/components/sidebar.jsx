import React, { useState, useEffect } from "react";
import {
  FiLogOut,
  FiActivity,
  FiPieChart,
  FiBarChart,
  FiMessageSquare,
} from "react-icons/fi";
import { IoIosBook, IoIosPeople } from "react-icons/io";
import {
  FaChalkboardTeacher,
  FaUserCircle,
  FaCalendarAlt,
  FaUserGraduate,
} from "react-icons/fa";
import {
  MdDashboard,
  MdAssignmentTurnedIn,
  MdNotificationsActive,
  MdSettings,
} from "react-icons/md";
import { BsClipboardData } from "react-icons/bs";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowDropDownLine,
} from "react-icons/ri";
import CampanyLogo from "../assets/logo.png";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "../features/Authentication";
import toast from "react-hot-toast";
import { useDarkMode } from "../context/DarkModeContext";

function Sidebar({ isOpen, setIsOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useDarkMode();
  const [dropdowns, setDropdowns] = useState({
    classes: false,
    academic: false,
  });
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const { Authuser } = useSelector((state) => state.auth);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-close sidebar on mobile when resizing to larger screens
      if (window.innerWidth >= 768 && !isOpen) {
        setIsOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  // Auto-close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleDropdown = (key) => {
    setDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success("Logged out successfully");
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 200);
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout error:", error);
    }
  };

  // Check if a link is active
  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  // Animation variants
  const sidebarVariants = {
    open: {
      width: isMobile ? "100vw" : "16rem",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    closed: {
      width: isMobile ? "0" : "5rem",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  const linkVariants = {
    open: { opacity: 1, x: 0, transition: { duration: 0.2 } },
    closed: { opacity: 0, x: -10, transition: { duration: 0.2 } },
  };

  const logoVariants = {
    open: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    closed: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
  };

  // Hover animation for icons
  const iconVariants = {
    hover: { scale: 1.2, rotate: 5, transition: { duration: 0.2 } },
    initial: { scale: 1, rotate: 0, transition: { duration: 0.2 } },
  };

  return (
    <>
      {/* Mobile overlay when sidebar is open */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-40"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      <motion.div
        className={`fixed min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-gray-900 text-white shadow-xl pt-12 z-50 ${
          isMobile ? "inset-y-0 left-0" : ""
        }`}
        variants={sidebarVariants}
        animate={isOpen ? "open" : "closed"}
        initial={isOpen ? "open" : "closed"}
      >
        <div className="flex flex-col h-full p-2 sm:p-3 relative">
          {/* Header with Logo and Toggle */}
          <div className="flex justify-between items-center mb-3 relative h-8">
            <motion.div
              variants={logoVariants}
              animate={isOpen ? "open" : "closed"}
              className="overflow-hidden ml-2"
            >
              {isOpen && (
                <motion.img
                  src={CampanyLogo}
                  alt="Company logo"
                  className="w-16 sm:w-20"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </motion.div>

            <motion.button
              onClick={toggleSidebar}
              className={`text-white hover:bg-blue-700/50 p-2 rounded-full transition-colors ${
                isMobile ? "absolute right-2" : "absolute -right-2"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                animate={{ rotate: isOpen ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? (
                  <RiArrowLeftSLine size={20} />
                ) : (
                  <RiArrowRightSLine size={20} />
                )}
              </motion.div>
            </motion.button>
          </div>

          {/* User Profile Section */}
          {isOpen && (
            <motion.div
              className="flex items-center mb-4 px-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden mr-3 border-2 border-blue-400">
                {Authuser?.ProfilePic ? (
                  <img
                    src={Authuser.ProfilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">
                      {Authuser?.firstName?.charAt(0) || "A"}
                    </span>
                  </div>
                )}
              </div>
              <div className="overflow-hidden">
                <p className="font-medium text-white truncate text-xs sm:text-sm">
                  {`${Authuser?.firstName || ""} ${Authuser?.lastName || ""}`}
                </p>
                <p className="text-xs text-blue-300 capitalize">
                  {Authuser?.role || "Admin"}
                </p>
              </div>
            </motion.div>
          )}

          {/* Navigation Menu */}
          <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-hide">
            <NavLink
              to={
                Authuser?.role?.toLowerCase() === "admin"
                  ? "/admin/home"
                  : `/${Authuser?.role?.toLowerCase()}/home`
              }
              icon={<MdDashboard />}
              title="Dashboard"
              isOpen={isOpen}
              active={isActive("home") || isActive("dashboard")}
              onHover={() => setHoveredItem("dashboard")}
              isHovered={hoveredItem === "dashboard"}
            />

            {/* ==== TEACHER SECTION ==== */}
            {Authuser?.role === "teacher" && (
              <>
                <div className="relative">
                  <motion.button
                    onClick={() => handleDropdown("classes")}
                    className={`flex items-center w-full space-x-3 p-2.5 rounded-lg transition-all duration-200 ${
                      dropdowns.classes ? "bg-blue-700" : "hover:bg-blue-700/50"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onHoverStart={() => setHoveredItem("classes")}
                    onHoverEnd={() => setHoveredItem(null)}
                  >
                    <motion.div
                      variants={iconVariants}
                      animate={hoveredItem === "classes" ? "hover" : "initial"}
                    >
                      <FaChalkboardTeacher className="text-xl min-w-[20px]" />
                    </motion.div>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          variants={linkVariants}
                          animate={isOpen ? "open" : "closed"}
                          exit={{ opacity: 0, x: -10 }}
                          className="flex items-center justify-between flex-1"
                        >
                          <span>My Classes</span>
                          <motion.div
                            animate={{ rotate: dropdowns.classes ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <RiArrowDropDownLine className="text-3xl" />
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  {/* Dropdown line indicator */}
                  <AnimatePresence>
                    {dropdowns.classes && isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "8rem" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute left-2.5 top-[40px] w-0.5 bg-blue-400 rounded-full"
                      />
                    )}
                  </AnimatePresence>

                  {/* Dropdown items */}
                  <AnimatePresence>
                    {dropdowns.classes && isOpen && (
                      <motion.ul
                        className="pl-8 mt-2 space-y-3"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.li
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Link
                            to="/teacher/TeachersAssignmentpage"
                            className="flex items-center space-x-3 text-md hover:text-yellow-300 py-1 px-2 rounded-md transition-colors"
                          >
                            <MdAssignmentTurnedIn className="text-lg text-yellow-300" />
                            <span>Assignments</span>
                          </Link>
                        </motion.li>
                        <motion.li
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Link
                            to="/teacher/Attendancepage"
                            className="flex items-center space-x-3 text-md hover:text-yellow-300 py-1 px-2 rounded-md transition-colors"
                          >
                            <BsClipboardData className="text-lg text-yellow-300" />
                            <span>Attendance</span>
                          </Link>
                        </motion.li>
                        <motion.li
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <Link
                            to="/teacher/classes"
                            className="flex items-center space-x-3 text-md hover:text-yellow-300 py-1 px-2 rounded-md transition-colors"
                          >
                            <FaChalkboardTeacher className="text-lg text-yellow-300" />
                            <span>Class Management</span>
                          </Link>
                        </motion.li>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>

                <NavLink
                  to="/teacher/TeacherSubject"
                  icon={<IoIosBook />}
                  title="Subjects"
                  isOpen={isOpen}
                  active={isActive("TeacherSubject")}
                  onHover={() => setHoveredItem("subjects")}
                  isHovered={hoveredItem === "subjects"}
                />
                <NavLink
                  to="/teacher/timetable"
                  icon={<FaCalendarAlt />}
                  title="Timetable"
                  isOpen={isOpen}
                  active={isActive("timetable")}
                  onHover={() => setHoveredItem("timetable")}
                  isHovered={hoveredItem === "timetable"}
                />
                <NavLink
                  to="/teacher/student-grade"
                  icon={<BsClipboardData />}
                  title="Grades"
                  isOpen={isOpen}
                  active={location.pathname === "/teacher"}
                  onHover={() => setHoveredItem("grades")}
                  isHovered={hoveredItem === "grades"}
                />
              </>
            )}

            {/* ==== STUDENT SECTION ==== */}
            {Authuser?.role === "student" && (
              <>
                <NavLink
                  to="/student/courses"
                  icon={<IoIosBook />}
                  title="Courses"
                  isOpen={isOpen}
                  active={isActive("courses")}
                  onHover={() => setHoveredItem("courses")}
                  isHovered={hoveredItem === "courses"}
                />
                <NavLink
                  to="/student/assignments"
                  icon={<MdAssignmentTurnedIn />}
                  title="Assignments"
                  isOpen={isOpen}
                  active={isActive("assignments")}
                  onHover={() => setHoveredItem("assignments")}
                  isHovered={hoveredItem === "assignments"}
                />
                <NavLink
                  to="/student/timetable"
                  icon={<FaCalendarAlt />}
                  title="Timetable"
                  isOpen={isOpen}
                  active={isActive("timetable")}
                  onHover={() => setHoveredItem("timetable")}
                  isHovered={hoveredItem === "timetable"}
                />
                <NavLink
                  to="/student/grades"
                  icon={<BsClipboardData />}
                  title="Grades"
                  isOpen={isOpen}
                  active={isActive("grades")}
                  onHover={() => setHoveredItem("grades")}
                  isHovered={hoveredItem === "grades"}
                />
              </>
            )}

            {/* ==== ADMIN / MANAGER SECTION ==== */}
            {(Authuser?.role === "admin" || Authuser?.role === "manager") && (
              <>
                <div className="relative">
                  <motion.button
                    onClick={() => handleDropdown("academic")}
                    className={`flex items-center w-full space-x-3 p-2.5 rounded-lg transition-all duration-200 ${
                      dropdowns.academic
                        ? "bg-blue-700"
                        : "hover:bg-blue-700/50"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onHoverStart={() => setHoveredItem("academic")}
                    onHoverEnd={() => setHoveredItem(null)}
                  >
                    <motion.div
                      variants={iconVariants}
                      animate={hoveredItem === "academic" ? "hover" : "initial"}
                    >
                      <FiPieChart className="text-xl min-w-[20px]" />
                    </motion.div>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          variants={linkVariants}
                          animate={isOpen ? "open" : "closed"}
                          exit={{ opacity: 0, x: -10 }}
                          className="flex items-center justify-between flex-1"
                        >
                          <span>Academic</span>
                          <motion.div
                            animate={{ rotate: dropdowns.academic ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <RiArrowDropDownLine className="text-3xl" />
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  {/* Dropdown line indicator */}
                  <AnimatePresence>
                    {dropdowns.academic && isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "8rem" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute left-2.5 top-[40px] w-0.5 bg-blue-400 rounded-full"
                      />
                    )}
                  </AnimatePresence>

                  {/* Dropdown items */}
                  <AnimatePresence>
                    {dropdowns.academic && isOpen && (
                      <motion.ul
                        className="pl-8 mt-2 space-y-3"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.li
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <Link
                            to="/admin/AdminTeacher"
                            className="flex items-center space-x-3 text-md hover:text-yellow-300 py-1 px-2 rounded-md transition-colors"
                          >
                            <FaChalkboardTeacher className="text-lg text-yellow-300" />
                            <span>Teachers</span>
                          </Link>
                        </motion.li>
                        <motion.li
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Link
                            to="/admin/students"
                            className="flex items-center space-x-3 text-md hover:text-yellow-300 py-1 px-2 rounded-md transition-colors"
                          >
                            <FaUserGraduate className="text-lg text-yellow-300" />
                            <span>Students</span>
                          </Link>
                        </motion.li>
                        <motion.li
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Link
                            to="/admin/Timetable"
                            className="flex items-center space-x-3 text-md hover:text-yellow-300 py-1 px-2 rounded-md transition-colors"
                          >
                            <FaCalendarAlt className="text-lg text-yellow-300" />
                            <span>Timetable</span>
                          </Link>
                        </motion.li>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>

                <NavLink
                  to="/admin/AdminTeacher"
                  icon={<FaChalkboardTeacher />}
                  title="Teachers"
                  isOpen={isOpen}
                  active={isActive("AdminTeacher")}
                  onHover={() => setHoveredItem("teachers")}
                  isHovered={hoveredItem === "teachers"}
                />
                <NavLink
                  to="/admin/students"
                  icon={<FaUserGraduate />}
                  title="Students"
                  isOpen={isOpen}
                  active={isActive("students")}
                  onHover={() => setHoveredItem("students")}
                  isHovered={hoveredItem === "students"}
                />
                <NavLink
                  to="/admin/Timetable"
                  icon={<FaCalendarAlt />}
                  title="Timetable"
                  isOpen={isOpen}
                  active={isActive("Timetable")}
                  onHover={() => setHoveredItem("timetable")}
                  isHovered={hoveredItem === "timetable"}
                />
                <NavLink
                  to="/admin/fee"
                  icon={<FiBarChart />}
                  title="Fee Management"
                  isOpen={isOpen}
                  active={isActive("fee")}
                  onHover={() => setHoveredItem("fee")}
                  isHovered={hoveredItem === "fee"}
                />
                <NavLink
                  to="/admin/settings"
                  icon={<MdSettings />}
                  title="Settings"
                  isOpen={isOpen}
                  active={isActive("settings")}
                  onHover={() => setHoveredItem("settings")}
                  isHovered={hoveredItem === "settings"}
                />
              </>
            )}

            {/* Common items */}
            <NavLink
              to={`/${Authuser?.role}/account`}
              icon={<FaUserCircle />}
              title="Account Setting"
              isOpen={isOpen}
              active={isActive("account")}
              onHover={() => setHoveredItem("account")}
              isHovered={hoveredItem === "account"}
            />

            <NavLink
              to={`/${Authuser?.role}/notifications`}
              icon={<MdNotificationsActive />}
              title="Notifications"
              isOpen={isOpen}
              active={isActive("notifications")}
              onHover={() => setHoveredItem("notifications")}
              isHovered={hoveredItem === "notifications"}
            />

            {/* Contact Developers Link */}
            <a
              href="https://t.me/abi_la"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center w-full space-x-3 p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
                darkMode
                  ? "text-blue-400 hover:bg-blue-800/30 hover:text-blue-300"
                  : "text-blue-600 hover:bg-blue-100 hover:text-blue-700"
              }`}
              onMouseEnter={() => setHoveredItem("contact")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <motion.div
                variants={iconVariants}
                animate={hoveredItem === "contact" ? "hover" : "initial"}
                className="text-base sm:text-lg min-w-[16px]"
              >
                <FiMessageSquare />
              </motion.div>
              <AnimatePresence>
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs sm:text-sm"
                  >
                    Contact Developers
                  </motion.span>
                )}
              </AnimatePresence>
            </a>

            {/* Logout Section */}
            <div className="mt-auto border-t border-blue-700/50 pt-3">
              <motion.button
                onClick={handleLogout}
                className="flex items-center w-full space-x-3 p-2 rounded-lg text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setHoveredItem("logout")}
                onHoverEnd={() => setHoveredItem(null)}
              >
                <motion.div
                  variants={iconVariants}
                  animate={hoveredItem === "logout" ? "hover" : "initial"}
                >
                  <FiLogOut className="text-lg min-w-[20px]" />
                </motion.div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.span
                      variants={linkVariants}
                      animate={isOpen ? "open" : "closed"}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-xs sm:text-sm"
                    >
                      Logout
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </nav>
        </div>
      </motion.div>
    </>
  );
}

// Helper component for navigation links
function NavLink({ to, icon, title, isOpen, active, onHover, isHovered }) {
  const baseClass =
    "flex items-center w-full space-x-3 p-1.5 sm:p-2 rounded-lg transition-all duration-200";
  const activeClass = active
    ? "bg-blue-800/60 text-white shadow-md"
    : "hover:bg-blue-800/30 text-gray-200 hover:text-white";

  // Animation variants for icons
  const iconVariants = {
    hover: { scale: 1.2, rotate: 5, transition: { duration: 0.2 } },
    initial: { scale: 1, rotate: 0, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={onHover}
      onHoverEnd={() => onHover(null)}
    >
      <Link to={to} className={`${baseClass} ${activeClass}`}>
        <motion.div
          className="text-base sm:text-lg min-w-[16px]"
          variants={iconVariants}
          animate={isHovered ? "hover" : "initial"}
        >
          {icon}
        </motion.div>
        <AnimatePresence>
          {isOpen && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="text-xs sm:text-sm"
            >
              {title}
            </motion.span>
          )}
        </AnimatePresence>
      </Link>
    </motion.div>
  );
}

export default Sidebar;
