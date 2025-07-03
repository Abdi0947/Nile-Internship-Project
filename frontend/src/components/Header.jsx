import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../assets/logo.png";
import { FiMoon, FiSun, FiX, FiMenu } from "react-icons/fi";
import { useDarkMode } from "../context/DarkModeContext";

const Header = () => {
  const navigate = useNavigate();
  const [showContactForm, setShowContactForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { darkMode, setDarkMode } = useDarkMode();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      const nav = document.querySelector(".mobile-nav");
      if (
        nav &&
        !nav.contains(event.target) &&
        !event.target.closest(".mobile-menu-button")
      ) {
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Helper classes for light/dark mode
  const navBg = darkMode
    ? "bg-gradient-to-r from-gray-900 to-gray-800"
    : "bg-gray-100";
  const textMain = darkMode ? "text-white" : "text-black";
  const textSubtle = darkMode ? "text-gray-300" : "text-gray-600";
  const featuresSectionText = darkMode ? "text-white" : "text-gray-800";
  const btnBg = darkMode
    ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
    : "bg-gray-200 text-black hover:bg-gray-300";
  const scrolledNav = isScrolled ? "shadow-lg" : "";

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div>
      <nav
        className={`fixed top-0 left-0 w-full ${navBg} ${scrolledNav} h-20 md:h-24 pt-2 px-4 md:px-5 z-50 transition-all duration-300`}
      >
        <div className="max-w-7xl mx-auto px-2 md:px-4">
          <div className="flex justify-between items-center">
            {/* Logo and Title */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <img
                src={Logo}
                alt="Logo"
                className="h-14 w-14 md:h-20 md:w-18 object-contain"
                onClick={() => navigate("/")}
                style={{ cursor: "pointer" }}
              />
              <span
                className={`font-semibold ${textMain} text-base md:text-lg whitespace-nowrap`}
              >
                School Smart
              </span>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                onClick={() => setDarkMode((prev) => !prev)}
                className={`p-2 rounded-full shadow transition-colors duration-200 ${btnBg}`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>
              <button
                className="mobile-menu-button p-2 rounded-md focus:outline-none"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <FiX className={`text-2xl ${textMain}`} />
                ) : (
                  <FiMenu className={`text-2xl ${textMain}`} />
                )}
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
              <Link
                to="/"
                className={`py-2 px-3 font-medium hover:text-green-400 transition duration-300 ${textMain} text-sm lg:text-base`}
              >
                Home
              </Link>
              <Link
                to="/#features"
                className={`py-2 px-3 font-medium hover:text-green-400 transition duration-300 ${featuresSectionText} text-sm lg:text-base`}
              >
                Features
              </Link>
              <button
                onClick={() => setShowContactForm(true)}
                className={`py-2 px-3 font-medium hover:text-green-400 transition duration-300 ${textMain} text-sm lg:text-base`}
              >
                Contact
              </button>
            </div>

            {/* Desktop Login & Register Buttons + Dark Mode Toggle */}
            <div className="hidden md:flex space-x-2 lg:space-x-3 items-center">
              <button
                onClick={() => setDarkMode((prev) => !prev)}
                className={`p-2 rounded-full shadow transition-colors duration-200 ${btnBg}`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>
              <button
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white w-28 lg:w-32 h-9 lg:h-10 hover:from-green-600 hover:to-blue-600 rounded-lg transition-colors duration-300 text-xs lg:text-sm"
                onClick={() => navigate("/register")}
              >
                Register Now
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className={`mobile-nav md:hidden absolute top-20 left-0 right-0 ${navBg} shadow-lg transition-all duration-300 overflow-hidden`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-3 space-y-3">
                <Link
                  to="/"
                  className={`block py-2 px-3 font-medium hover:text-green-400 transition duration-300 ${textMain}`}
                  onClick={closeMobileMenu}
                >
                  Home
                </Link>
                <Link
                  to="/#features"
                  className={`block py-2 px-3 font-medium hover:text-green-400 transition duration-300 ${featuresSectionText}`}
                  onClick={closeMobileMenu}
                >
                  Features
                </Link>
                <button
                  onClick={() => {
                    setShowContactForm(true);
                    closeMobileMenu();
                  }}
                  className={`block py-2 px-3 font-medium hover:text-green-400 transition duration-300 ${textMain} w-full text-left`}
                >
                  Contact
                </button>
                <button
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 rounded-lg hover:from-green-600 hover:to-blue-600 transition-colors text-sm"
                  onClick={() => {
                    navigate("/register");
                    closeMobileMenu();
                  }}
                >
                  Register Now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pt-20 md:pt-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{
              background: darkMode
                ? "linear-gradient(to right, rgba(22, 28, 36, 0.95), rgba(48, 54, 61, 0.95))"
                : "linear-gradient(to right, rgba(243,244,246,0.98), rgba(229,231,235,0.98))",
            }}
            className="backdrop-blur-md rounded-lg p-4 md:p-6 max-w-md w-full mx-4 relative"
          >
            {/* Close Button */}
            <button
              className={`absolute top-2 right-2 ${textSubtle} hover:text-black dark:hover:text-white text-2xl font-bold`}
              onClick={() => setShowContactForm(false)}
            >
              ×
            </button>

            <div className="text-center mb-4">
              <h1 className={`text-xl md:text-2xl font-bold ${textMain}`}>
                Contact Us
              </h1>
              <p className={`${textSubtle} text-xs md:text-sm`}>
                We are here to help you.
              </p>
            </div>

            {/* Contact Form */}
            <form
              className={`space-y-3 p-4 md:p-6 rounded-lg shadow-2xl border-2 ${
                darkMode ? "border-gray-700" : "border-gray-300"
              }`}
              style={{
                background: darkMode
                  ? "linear-gradient(to right, rgba(31, 41, 55, 0.9), rgba(38, 47, 61, 0.9))"
                  : "linear-gradient(to right, rgba(243,244,246,0.97), rgba(229,231,235,0.97))",
              }}
            >
              <div>
                <label
                  className={`block text-xs md:text-sm mb-1 ${textSubtle}`}
                >
                  Name:
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 border ${
                    darkMode
                      ? "border-gray-600 bg-gray-800/50 text-white placeholder-gray-400"
                      : "border-gray-300 bg-gray-200/70 text-black placeholder-gray-500"
                  } rounded-md shadow-md focus:ring-2 focus:ring-green-400 focus:border-green-400 text-xs md:text-sm`}
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label
                  className={`block text-xs md:text-sm mb-1 ${textSubtle}`}
                >
                  Email:
                </label>
                <input
                  type="email"
                  className={`w-full px-3 py-2 border ${
                    darkMode
                      ? "border-gray-600 bg-gray-800/50 text-white placeholder-gray-400"
                      : "border-gray-300 bg-gray-200/70 text-black placeholder-gray-500"
                  } rounded-md shadow-md focus:ring-2 focus:ring-green-400 focus:border-green-400 text-xs md:text-sm`}
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label
                  className={`block text-xs md:text-sm mb-1 ${textSubtle}`}
                >
                  Phone:
                </label>
                <div className="flex">
                  <select
                    className={`py-2 border ${
                      darkMode
                        ? "border-gray-600 bg-gray-800/50 text-white"
                        : "border-gray-300 bg-white text-black"
                    } text-xs md:text-sm rounded-l-md focus:ring-2 focus:ring-green-400 focus:border-green-400`}
                  >
                    <option value="+251">Ethiopia(+251)</option>
                    <option value="+1">USA(+1)</option>
                    <option value="+44">UK (+44)</option>
                    <option value="+91">India (+91)</option>
                  </select>
                  <input
                    type="tel"
                    className={`w-full px-3 py-2 border border-l-0 ${
                      darkMode
                        ? "border-gray-600 bg-gray-800/50 text-white"
                        : "border-gray-300 bg-white text-black"
                    } text-xs md:text-sm rounded-r-md focus:ring-2 focus:ring-green-400 focus:border-green-400 placeholder-gray-400`}
                    placeholder="Phone number"
                  />
                </div>
              </div>

              <div>
                <label
                  className={`block text-xs md:text-sm mb-1 ${textSubtle}`}
                >
                  Details:
                </label>
                <textarea
                  className={`w-full px-3 py-2 border ${
                    darkMode
                      ? "border-gray-600 bg-gray-800/50 text-white placeholder-gray-400"
                      : "border-gray-300 bg-gray-200/70 text-black placeholder-gray-500"
                  } rounded-md shadow-md focus:ring-2 focus:ring-green-400 focus:border-green-400 text-xs md:text-sm`}
                  rows="3"
                  placeholder="Enter your message"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 rounded-md hover:from-green-600 hover:to-blue-600 transition-colors text-xs md:text-sm shadow-lg"
              >
                Submit
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Header;
