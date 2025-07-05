import React, { useState, useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FiSave, FiX, FiBell, FiLock, FiUser, FiCamera } from 'react-icons/fi';
import { motion } from 'framer-motion';
import TopNavbar from '../components/Topnavbar';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserInfo } from '../features/Authentication';
import toast from 'react-hot-toast';
import ProfilePicture from '../components/ProfilePicture';

const AccountSettings = () => {
  const { Authuser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('profile');
  const [previewImage, setPreviewImage] = useState(null);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [profileImageKey, setProfileImageKey] = useState(Date.now());
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (Authuser?.ProfilePic) {
      setPreviewImage(Authuser.ProfilePic);
    }
  }, [Authuser]);

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target.result;
      setPreviewImage(imageData);
      
      handleProfileImageUpdate(imageData);
    };
    
    reader.onerror = () => {
      toast.error('Failed to read image file');
    };
    
    reader.readAsDataURL(file);
  };

  const handleProfileImageUpdate = async (imageData) => {
    try {
      const userData = {
        ...profileForm.values,
        ProfilePic: imageData,
      };
      
      await dispatch(updateUserInfo(userData)).unwrap();
      setProfileImageKey(Date.now());
      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Failed to update profile image:', error);
      toast.error('Failed to update profile picture');
    }
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  // Profile form validation schema
  const profileSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().nullable(),
    address: Yup.string().nullable(),
  });

  // Password change validation schema
  const passwordSchema = Yup.object({
    currentPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  // Profile form
  const profileForm = useFormik({
    initialValues: {
      firstName: Authuser?.firstName || '',
      lastName: Authuser?.lastName || '',
      email: Authuser?.email || '',
      phone: Authuser?.phone || '',
      address: Authuser?.address || '',
    },
    validationSchema: profileSchema,
    onSubmit: (values) => {
      handleProfileUpdate(values);
    },
    enableReinitialize: true, // Important to update form when Authuser changes
  });

  // Password form
  const passwordForm = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: passwordSchema,
    onSubmit: (values) => {
      handlePasswordChange(values);
    },
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    securityAlerts: true,
    marketingEmails: false,
  });

  const handleNotificationChange = (setting) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleProfileUpdate = async (values) => {
    try {
      // Update profile information
      await dispatch(updateUserInfo(values)).unwrap();
      
      setShowSavedMessage(true);
      setTimeout(() => setShowSavedMessage(false), 3000);
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
    }
  };

  const handlePasswordChange = async (values) => {
    try {
      // Implement password change API call here
      toast.success('Password changed successfully');
      passwordForm.resetForm();
    } catch (error) {
      toast.error('Failed to change password');
      console.error('Password change error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <TopNavbar />
      
      <motion.div 
        className="container mx-auto px-4 py-8"
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        <motion.h1 
          className="text-2xl font-bold text-gray-800 mb-6"
          variants={itemVariants}
        >
          Account Settings
        </motion.h1>
        
        {/* Tabs */}
        <motion.div 
          className="bg-white rounded-lg shadow-md mb-6 p-1 flex"
          variants={itemVariants}
        >
          <button
            className={`flex items-center px-4 py-2 rounded-md ${
              activeTab === 'profile'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            } transition-colors duration-200 flex-1 justify-center md:flex-none md:justify-start`}
            onClick={() => setActiveTab('profile')}
          >
            <FiUser className="mr-2" />
            <span>Profile</span>
          </button>
          <button
            className={`flex items-center px-4 py-2 rounded-md ${
              activeTab === 'security'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            } transition-colors duration-200 flex-1 justify-center md:flex-none md:justify-start`}
            onClick={() => setActiveTab('security')}
          >
            <FiLock className="mr-2" />
            <span>Security</span>
          </button>
          <button
            className={`flex items-center px-4 py-2 rounded-md ${
              activeTab === 'notifications'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            } transition-colors duration-200 flex-1 justify-center md:flex-none md:justify-start`}
            onClick={() => setActiveTab('notifications')}
          >
            <FiBell className="mr-2" />
            <span>Notifications</span>
          </button>
        </motion.div>
        
        {/* Tab Content */}
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6"
          variants={itemVariants}
        >
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={profileForm.handleSubmit}>
              <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                <div className="flex-shrink-0">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 cursor-pointer group" onClick={handleFileSelect}>
                    {previewImage ? (
                      <img 
                        src={previewImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        key={profileImageKey}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-4xl">
                        {profileForm.values.firstName ? profileForm.values.firstName.charAt(0).toUpperCase() : <FiUser size={40} />}
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <FiCamera className="text-white text-2xl" />
                    </div>
                  </div>
                  
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  
                  <button
                    type="button"
                    onClick={handleFileSelect}
                    className="mt-3 text-blue-600 text-sm hover:underline focus:outline-none flex items-center justify-center w-full"
                  >
                    Change Photo
                  </button>
                </div>
                
                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={profileForm.values.firstName}
                      onChange={profileForm.handleChange}
                      onBlur={profileForm.handleBlur}
                      className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    {profileForm.touched.firstName && profileForm.errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{profileForm.errors.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileForm.values.lastName}
                      onChange={profileForm.handleChange}
                      onBlur={profileForm.handleBlur}
                      className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    {profileForm.touched.lastName && profileForm.errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{profileForm.errors.lastName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileForm.values.email}
                      onChange={profileForm.handleChange}
                      onBlur={profileForm.handleBlur}
                      className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    {profileForm.touched.email && profileForm.errors.email && (
                      <p className="text-red-500 text-xs mt-1">{profileForm.errors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={profileForm.values.phone}
                      onChange={profileForm.handleChange}
                      onBlur={profileForm.handleBlur}
                      className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={profileForm.values.address}
                      onChange={profileForm.handleChange}
                      onBlur={profileForm.handleBlur}
                      className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <FiSave /> Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => profileForm.resetForm()}
                  className="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <FiX /> Cancel
                </button>
                
                {showSavedMessage && (
                  <motion.span 
                    className="ml-auto text-green-600 flex items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Changes saved!
                  </motion.span>
                )}
              </div>
            </form>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <form onSubmit={passwordForm.handleSubmit}>
              <h2 className="text-xl font-medium text-gray-800 mb-6">Change Password</h2>
              
              <div className="grid grid-cols-1 gap-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.values.currentPassword}
                    onChange={passwordForm.handleChange}
                    onBlur={passwordForm.handleBlur}
                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  {passwordForm.touched.currentPassword && passwordForm.errors.currentPassword && (
                    <p className="text-red-500 text-xs mt-1">{passwordForm.errors.currentPassword}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.values.newPassword}
                    onChange={passwordForm.handleChange}
                    onBlur={passwordForm.handleBlur}
                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  {passwordForm.touched.newPassword && passwordForm.errors.newPassword && (
                    <p className="text-red-500 text-xs mt-1">{passwordForm.errors.newPassword}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.values.confirmPassword}
                    onChange={passwordForm.handleChange}
                    onBlur={passwordForm.handleBlur}
                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  {passwordForm.touched.confirmPassword && passwordForm.errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{passwordForm.errors.confirmPassword}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4 pt-6 mt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <FiSave /> Update Password
                </button>
                <button
                  type="button"
                  onClick={() => passwordForm.resetForm()}
                  className="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <FiX /> Cancel
                </button>
              </div>
            </form>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-xl font-medium text-gray-800 mb-6">Notification Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-600">Receive email notifications for important updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={notifications.emailNotifications}
                      onChange={() => handleNotificationChange('emailNotifications')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">SMS Notifications</h3>
                    <p className="text-sm text-gray-600">Receive text messages for critical alerts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={notifications.smsNotifications}
                      onChange={() => handleNotificationChange('smsNotifications')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Security Alerts</h3>
                    <p className="text-sm text-gray-600">Get notified about security-related activities</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={notifications.securityAlerts}
                      onChange={() => handleNotificationChange('securityAlerts')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Marketing Emails</h3>
                    <p className="text-sm text-gray-600">Receive marketing emails about new features and updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={notifications.marketingEmails}
                      onChange={() => handleNotificationChange('marketingEmails')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center gap-4 pt-6 mt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => toast.success('Notification settings saved')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <FiSave /> Save Preferences
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AccountSettings; 