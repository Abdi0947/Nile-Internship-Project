import React, { useState } from "react";
import { Link } from "react-router-dom";
import CampanyLogo from '../assets/logo.png';
import { motion } from "framer-motion";
import toast from 'react-hot-toast';
import AuthNavbar from "../components/AuthNavbar";
import { useDarkMode } from "../context/DarkModeContext";
import axios from "axios";
import '../styles/email.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { darkMode } = useDarkMode();

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

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is not valid";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API endpoint when backend is ready
      // const response = await axiosInstance.post("/auth/forgot-password", { email });
      // Simulating API call for now
      const res = await axios.post(
        "http://localhost:5003/api/auth/forgot-password",
        { email }
      );
      
      setIsEmailSent(true);
      toast.success("Password reset instructions have been sent to your email");
    } catch (error) {
      console.error("Error in forgot password:", error);
      toast.error(error.response?.data?.message || "Failed to send reset email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`h-screen fixed inset-0 overflow-hidden font-poppins ${darkMode ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white' : 'bg-gray-200 text-gray-800'} flex flex-col transition-colors duration-300`}>
      <AuthNavbar />
      
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Simple gradient background */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/20' : 'bg-gradient-to-br from-gray-300/30 to-gray-400/20'}`}></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="smallGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                <path d="M 15 0 L 0 0 0 15" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#smallGrid)" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-grow items-center justify-center pt-36 pb-8 overflow-auto px-4 sm:px-6">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-gray-100/90 border-gray-300/50'} backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border transition-colors duration-300`}>
            <div className="p-5 sm:p-6">
              <div className="flex justify-center mb-5 sm:mb-6">
                <img src={CampanyLogo} alt="Logo" className="h-14 sm:h-16 w-auto" />
              </div>

              {/* Welcome Banner */}
              <div className="welcome-banner">
                <div className="welcome-banner-content">
                  <div className="welcome-banner-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h2 className="welcome-banner-title">Welcome to Secure Reset</h2>
                  <p className="welcome-banner-subtitle">
                    We're here to help you regain access to your account. Our secure password reset process ensures your account stays protected.
                  </p>
                </div>
              </div>
              
              <motion.div variants={itemVariants} className="text-center mb-5 sm:mb-6">
                <h2 className={`text-xl sm:text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Forgot Password</h2>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                  {isEmailSent 
                    ? "Check your email for password reset instructions"
                    : "Enter your email address and we'll send you instructions to reset your password"}
                </p>
              </motion.div>

              {!isEmailSent ? (
                <form onSubmit={handleSubmit}>
                  <motion.div variants={itemVariants} className="mb-5">
                    <label className={`block ${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-1 font-medium`}>Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full p-2.5 sm:p-3 ${
                        darkMode 
                          ? 'bg-gray-700/50 border-gray-600 text-white' 
                          : 'bg-gray-200/70 border-gray-300 text-gray-800'
                      } border rounded-lg outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300`}
                      placeholder="Enter your email"
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </motion.div>

                  <motion.button
                    variants={itemVariants}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                    whileHover={{ scale: isSubmitting ? 1 : 1.03 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : "Send Reset Instructions"}
                  </motion.button>
                </form>
              ) : (
                <motion.div 
                  variants={itemVariants}
                  className="email-sent-container"
                >
                  <div className="email-sent-icon">
                    <div className="email-sent-icon-circle">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="email-sent-message">
                    <h3 className="email-sent-title">Check Your Email</h3>
                    <p className="email-sent-description">
                      We've sent password reset instructions to your email address. 
                      Please check your inbox and follow the link to reset your password.
                    </p>
                  </div>

                  <div className="email-sent-actions">
                    <button
                      onClick={() => setIsEmailSent(false)}
                      className="email-sent-button email-sent-button-secondary"
                    >
                      Try Another Email
                    </button>
                    <Link
                      to="/login"
                      className="email-sent-button email-sent-button-primary"
                    >
                      Back to Login
                    </Link>
                  </div>
                </motion.div>
              )}

              {!isEmailSent && (
                <motion.div variants={itemVariants} className="mt-5 text-center">
                  <Link
                    to="/login"
                    className={`text-sm ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'} hover:underline`}
                  >
                    Back to Login
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword; 