import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import CampanyLogo from '../assets/logo.png';
import { signup } from "../features/Authentication";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from "framer-motion";
import toast from 'react-hot-toast';
import { FiUpload, FiCamera } from 'react-icons/fi';
import { compressImage, formatFileSize } from '../lib/imageUtils';
import AuthNavbar from '../components/AuthNavbar';
import { useDarkMode } from '../context/DarkModeContext';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmpassword: '',
    role: '',
    agreeTerms: false,
    ProfilePic: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [signupError, setSignupError] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isUserSignup } = useSelector(state => state.auth);
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, ProfilePic: 'Image size should be less than 10MB' }));
      return;
    }

    try {
      // Show loading state
      toast.loading('Processing image...');
      
      // Compress the image
      const compressedImage = await compressImage(file, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.7
      });
      
      // Update form state with compressed image
      setPreviewImage(compressedImage);
      setFormData(prev => ({ ...prev, ProfilePic: compressedImage }));
      setErrors(prev => ({ ...prev, ProfilePic: '' }));
      
      // Show success message with size reduction
      const originalSize = formatFileSize(file.size);
      const newSize = formatFileSize(compressedImage.length * 0.75); // Rough base64 to binary conversion
      toast.dismiss();
      toast.success(`Image optimized: ${originalSize} → ${newSize}`);
    } catch (error) {
      console.error('Image compression error:', error);
      toast.dismiss();
      toast.error('Failed to process image');
      
      // Fallback to regular file reader if compression fails
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({ ...prev, ProfilePic: reader.result }));
        setErrors(prev => ({ ...prev, ProfilePic: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (formData.password !== formData.confirmpassword) {
      newErrors.confirmpassword = 'Passwords do not match';
      isValid = false;
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role';
      isValid = false;
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setSignupError('');
        const { confirmpassword, agreeTerms, ...payload } = formData;
        
        const resultAction = await dispatch(signup(payload));
        
        if (signup.fulfilled.match(resultAction)) {
          // toast.success('Account created successfully!');
          
          const userRole = resultAction.payload.savedUser.role.toLowerCase();
          switch (userRole) {
            case 'admin':
              navigate('/admin/dashboard');
              break;
            case 'teacher':
              navigate('/teacher');
              break;
            case 'student':
              navigate('/student/home');
              break;
            case 'manager':
              navigate('/admin/manage');
              break;
            default:
              navigate('/');
          }
        } else if (signup.rejected.match(resultAction)) {
          setSignupError(resultAction.payload || 'Failed to create account. Please try again.');
        }
      } catch (error) {
        setSignupError('Error creating account. Please try again.');
      }
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-800'} transition-colors duration-300`}>
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
      <div className="flex flex-grow justify-center py-20 overflow-auto">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-2xl px-4"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-gray-700/50">
            <div className="p-6">
              <div className="flex justify-center mb-4">
                <img src={CampanyLogo} alt="Logo" className="h-16 w-auto" />
              </div>
              
              <motion.div variants={itemVariants} className="text-center mb-4">
                <h2 className="text-2xl font-bold mb-1 text-white">Create Account</h2>
                <p className="text-gray-300 text-sm">Join our school management system</p>
              </motion.div>

              {/* Signup Error Message */}
              {signupError && (
                <motion.div 
                  className="mb-4 p-2 bg-red-500/20 border border-red-500/50 rounded-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-red-300 text-sm">{signupError}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Profile Picture Upload */}
                <motion.div variants={itemVariants} className="flex flex-col items-center mb-3">
                  <div 
                    className="relative w-20 h-20 rounded-full overflow-hidden cursor-pointer mb-2 border-2 border-green-400 hover:border-green-300 transition-all duration-300 group"
                    onClick={triggerFileInput}
                  >
                    {previewImage ? (
                      <motion.img 
                        src={previewImage} 
                        alt="Profile preview" 
                        className="w-full h-full object-cover"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <FiCamera className="text-2xl text-gray-300 group-hover:text-white transition-colors" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <FiUpload className="text-white text-xl" />
                    </div>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <p className="text-xs text-gray-300">Upload profile photo</p>
                  {errors.ProfilePic && <p className="text-red-400 text-xs mt-1">{errors.ProfilePic}</p>}
                </motion.div>

                {/* Name Fields - 2 columns */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.div variants={itemVariants}>
                    <label className="block text-gray-300 text-xs mb-1 font-medium">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-lg outline-none text-white focus:ring-1 focus:ring-green-400 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="First name"
                    />
                    {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-gray-300 text-xs mb-1 font-medium">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-lg outline-none text-white focus:ring-1 focus:ring-green-400 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="Last name"
                    />
                    {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
                  </motion.div>
                </div>

                {/* Email */}
                <motion.div variants={itemVariants}>
                  <label className="block text-gray-300 text-xs mb-1 font-medium">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-lg outline-none text-white focus:ring-1 focus:ring-green-400 focus:border-transparent transition-all duration-300 text-sm"
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </motion.div>

                {/* Password fields - 2 columns */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Password */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-gray-300 text-xs mb-1 font-medium">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-lg outline-none text-white focus:ring-1 focus:ring-green-400 focus:border-transparent transition-all duration-300 text-sm"
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {showPassword ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                  </motion.div>

                  {/* Confirm Password */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-gray-300 text-xs mb-1 font-medium">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmpassword"
                      value={formData.confirmpassword}
                      onChange={handleChange}
                      className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-lg outline-none text-white focus:ring-1 focus:ring-green-400 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="Confirm password"
                    />
                    {errors.confirmpassword && <p className="text-red-400 text-xs mt-1">{errors.confirmpassword}</p>}
                  </motion.div>
                </div>

                {/* Role */}
                <motion.div variants={itemVariants}>
                  <label className="block text-gray-300 text-xs mb-1 font-medium">Select Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-lg outline-none text-white focus:ring-1 focus:ring-green-400 focus:border-transparent transition-all duration-300 text-sm"
                  >
                    <option value="">-- Select Role (as Admin only) --</option>
                    <option value="Admin">Admin</option>
                  </select>
                  {errors.role && <p className="text-red-400 text-xs mt-1">{errors.role}</p>}
                </motion.div>

                {/* Terms */}
                <motion.div variants={itemVariants} className="flex items-center gap-2">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="w-4 h-4 bg-gray-700 border-gray-600 rounded focus:ring-green-400 focus:ring-2"
                  />
                  <label htmlFor="agreeTerms" className="text-gray-300 text-xs">
                    I agree to the{' '}
                    <Link to="/terms" className="text-green-400 hover:underline">
                      Terms and Conditions
                    </Link>
                  </label>
                </motion.div>
                {errors.agreeTerms && <p className="text-red-400 text-xs">{errors.agreeTerms}</p>}

                <motion.div variants={itemVariants} className="pt-2">
                  <motion.button 
                    type="submit"
                    disabled={isUserSignup}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                    whileHover={{ scale: isUserSignup ? 1 : 1.03 }}
                    whileTap={{ scale: isUserSignup ? 1 : 0.98 }}
                  >
                    {isUserSignup ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                      </span>
                    ) : "Create Account"}
                  </motion.button>
                </motion.div>
              </form>
              
              <motion.p variants={itemVariants} className="text-center text-gray-300 mt-4 text-sm">
                Already have an account? {" "}
                <Link to="/login" className="text-green-400 font-medium hover:underline">
                  Log In
                </Link>
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
