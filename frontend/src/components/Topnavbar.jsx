import React, { useState, useRef, useEffect } from "react";
import {
  FiSearch,
  FiBell,
  FiSettings,
  FiLogOut,
  FiUser,
  FiSun,
  FiMoon,
  FiMenu,
} from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "../features/Authentication";
import toast from "react-hot-toast";
import NotificationDropdown from "./NotificationDropdown";
import ProfilePicture from "./ProfilePicture";
import { useDarkMode } from "../context/DarkModeContext";

function TopNavbar({ toggleSidebar }) {
  const { Authuser } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notification);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [profileImageKey, setProfileImageKey] = useState(Date.now());
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const searchRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, setDarkMode } = useDarkMode();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768 && isMobileSearchOpen) {
        setIsMobileSearchOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileSearchOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        isMobileSearchOpen
      ) {
        setIsMobileSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileSearchOpen]);

  // Close mobile search when navigating
  useEffect(() => {
    setIsMobileSearchOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 200);
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout error:", error);
    }
  };

  const getDisplayName = () => {
    if (!Authuser) return "User";
    return Authuser.firstName
      ? `${Authuser.firstName} ${Authuser.lastName || ""}`
      : Authuser.email?.split("@")[0] || "User";
  };

  const getUserRole = () => {
    if (!Authuser || !Authuser.role) return "";
    return (
      Authuser.role.charAt(0).toUpperCase() +
      Authuser.role.slice(1).toLowerCase()
    );
  };

  const toggleNotifications = (e) => {
    e.stopPropagation();
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isDropdownOpen) setIsDropdownOpen(false);
    if (isMobileSearchOpen) setIsMobileSearchOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsMobileSearchOpen(false);
    }
  };

  return (
    <div
      className={`
      ${darkMode ? "bg-gray-800" : "bg-white"} 
      shadow-md z-50 fixed top-0 left-0 right-0
    `}
    >
      <nav className="w-full h-12 flex items-center justify-between px-2 sm:px-4">
        {/* Left side - Menu button and Welcome message */}
        <div className="flex items-center space-x-2">
          {/* Mobile menu button - only shown on mobile */}
          <button
            onClick={toggleSidebar}
            className={`
              md:hidden p-1 rounded-full focus:outline-none
              ${
                darkMode
                  ? "text-white hover:bg-gray-700"
                  : "text-black hover:bg-gray-100"
              }
            `}
          >
            <FiMenu className="text-xl" />
          </button>

          <motion.h1
            className={`
              text-sm sm:text-base md:text-lg font-semibold truncate
              ${darkMode ? "text-white" : "text-black"}
              ${isMobile ? "max-w-[120px]" : "max-w-[180px] md:max-w-none"}
            `}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Welcome, {getDisplayName()}
          </motion.h1>
        </div>

        {/* Right side - Search, notifications, profile */}
        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
          {/* Mobile search button - only shown on mobile */}
          <button
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className={`
              md:hidden p-1 rounded-full focus:outline-none
              ${
                darkMode
                  ? "text-white hover:bg-gray-700"
                  : "text-black hover:bg-gray-100"
              }
            `}
          >
            <FiSearch className="text-lg" />
          </button>

          {/* Mobile search input - slides in from top */}
          <AnimatePresence>
            {isMobileSearchOpen && (
              <motion.div
                className="fixed top-12 left-0 right-0 z-40 px-2 py-1"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ duration: 0.2 }}
                ref={searchRef}
              >
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`
                      w-full py-2 pl-10 pr-4 rounded-lg focus:outline-none
                      ${
                        darkMode
                          ? "bg-gray-700 border border-gray-600 text-white placeholder-gray-400"
                          : "bg-gray-100 border border-gray-200 text-black placeholder-gray-500"
                      }
                    `}
                    autoFocus
                  />
                  <FiSearch
                    className={`
                    absolute left-3 top-1/2 transform -translate-y-1/2
                    ${darkMode ? "text-white" : "text-black"}
                  `}
                  />
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`
              p-1 rounded-full transition-colors focus:outline-none
              ${
                darkMode
                  ? "text-white hover:bg-gray-700"
                  : "text-black hover:bg-gray-100"
              }
            `}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {darkMode ? (
              <FiSun className="text-lg" />
            ) : (
              <FiMoon className="text-lg" />
            )}
          </button>

          {/* Desktop search - hidden on mobile */}
          <div className="relative hidden md:block" ref={searchRef}>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`
                  py-1 pl-8 pr-2 rounded-lg focus:outline-none focus:ring-2 transition-all text-sm
                  ${
                    darkMode
                      ? "bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500"
                      : "bg-gray-100 border border-gray-200 text-black placeholder-gray-500 focus:ring-blue-500"
                  }
                `}
              />
              <FiSearch
                className={`
                absolute left-2 top-1/2 transform -translate-y-1/2
                ${darkMode ? "text-white" : "text-black"}
              `}
              />
            </form>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              className={`
                relative p-1 rounded-full transition-colors focus:outline-none
                ${
                  darkMode
                    ? "text-white hover:bg-gray-700"
                    : "text-black hover:bg-gray-100"
                }
              `}
              onClick={toggleNotifications}
              aria-label="Notifications"
            >
              <FiBell className="text-lg" />
              {unreadCount > 0 && (
                <span
                  className={`
                  absolute top-0 right-0 w-4 h-4 text-xs rounded-full flex items-center justify-center
                  ${
                    darkMode ? "bg-red-500 text-white" : "bg-red-500 text-white"
                  }
                `}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            <NotificationDropdown
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
            />
          </div>

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-1 sm:space-x-2 focus:outline-none"
              aria-label="User profile"
            >
              <div
                className={`
                relative w-7 h-7 sm:w-8 sm:h-8 overflow-hidden rounded-full
                ${darkMode ? "border-blue-500" : "border-blue-500"} border-2
              `}
              >
                <ProfilePicture
                  profilePic={Authuser?.ProfilePic}
                  firstName={Authuser?.firstName}
                  size="small"
                  editable={false}
                  key={profileImageKey}
                />
              </div>
              <div className="hidden md:block text-left">
                <h2
                  className={`
                  font-medium text-xs sm:text-sm
                  ${darkMode ? "text-white" : "text-black"}
                `}
                >
                  {getDisplayName()}
                </h2>
                <p
                  className={`
                  text-xs
                  ${darkMode ? "text-gray-200" : "text-gray-600"}
                `}
                >
                  {getUserRole()}
                </p>
              </div>
            </button>

            {/* Dropdown menu */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  className={`
                    absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-2 z-50 border
                    ${
                      darkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-100"
                    }
                  `}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to={`/${Authuser?.role?.toLowerCase()}/account`}
                    className={`
                      flex items-center px-4 py-2 transition-colors
                      ${
                        darkMode
                          ? "text-white hover:bg-gray-700"
                          : "text-black hover:bg-gray-100"
                      }
                    `}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FiUser
                      className={`mr-3 ${
                        darkMode ? "text-gray-200" : "text-gray-500"
                      }`}
                    />
                    My Profile
                  </Link>
                  <Link
                    to={`/${Authuser?.role?.toLowerCase()}/settings`}
                    className={`
                      flex items-center px-4 py-2 transition-colors
                      ${
                        darkMode
                          ? "text-white hover:bg-gray-700"
                          : "text-black hover:bg-gray-100"
                      }
                    `}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FiSettings
                      className={`mr-3 ${
                        darkMode ? "text-gray-200" : "text-gray-500"
                      }`}
                    />
                    Settings
                  </Link>
                  <Link
                    to={`/${Authuser?.role?.toLowerCase()}/notifications`}
                    className={`
                      flex items-center px-4 py-2 transition-colors
                      ${
                        darkMode
                          ? "text-white hover:bg-gray-700"
                          : "text-black hover:bg-gray-100"
                      }
                    `}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FiBell
                      className={`mr-3 ${
                        darkMode ? "text-gray-200" : "text-gray-500"
                      }`}
                    />
                    Notifications
                    {unreadCount > 0 && (
                      <span
                        className={`
                        ml-auto text-xs rounded-full px-1.5 py-0.5
                        ${
                          darkMode
                            ? "bg-red-500 text-white"
                            : "bg-red-500 text-white"
                        }
                      `}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                  <hr
                    className={
                      darkMode ? "my-1 border-gray-700" : "my-1 border-gray-100"
                    }
                  />
                  <button
                    onClick={handleLogout}
                    className={`
                      w-full flex items-center px-4 py-2 transition-colors
                      ${
                        darkMode
                          ? "text-red-400 hover:bg-red-900/20"
                          : "text-red-600 hover:bg-red-50"
                      }
                    `}
                  >
                    <FiLogOut className="mr-3" />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>
      <hr className={darkMode ? "border-gray-700" : "border-gray-200"} />
    </div>
  );
}

export default TopNavbar;
