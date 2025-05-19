import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopNavbar from '../components/Topnavbar';
import { FiBell, FiMail, FiCalendar, FiBookOpen, FiTrash2, FiCheck, FiFilter } from 'react-icons/fi';
import { MdPayment, MdAssignment } from 'react-icons/md';

const Notificationpage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    system: true,
    academic: true,
    payment: true,
    message: true,
    calendar: true,
  });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/notifications');
        if (!response.ok) throw new Error('Failed to fetch notifications');
        const data = await response.json();
        setNotifications(data.notifications || []);
      } catch (error) {
        setNotifications([]);
        // Optionally show a toast or error message
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);
  
  // Filter notifications based on the active tab and type filters
  const filteredNotifications = notifications.filter(notification => {
    // Filter by read status
    if (activeTab === 'unread' && notification.read) return false;
    if (activeTab === 'read' && !notification.read) return false;
    
    // Filter by notification type
    return filters[notification.type];
  });
  
  // Toggle notification read status
  const toggleRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, read: !notification.read } 
        : notification
    ));
  };
  
  // Delete notification
  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };
  
  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };
  
  // Format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'system':
        return <FiBell className="text-blue-500" />;
      case 'academic':
        return <FiBookOpen className="text-green-500" />;
      case 'payment':
        return <MdPayment className="text-purple-500" />;
      case 'message':
        return <FiMail className="text-yellow-500" />;
      case 'calendar':
        return <FiCalendar className="text-red-500" />;
      default:
        return <FiBell className="text-gray-500" />;
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 10
      }
    }
  };
  
  // Calculate counts
  const unreadCount = notifications.filter(n => !n.read).length;
  const readCount = notifications.filter(n => n.read).length;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <TopNavbar />
      
      <motion.div 
        className="container mx-auto px-4 py-8 mt-14"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <motion.h1 
            className="text-2xl font-bold text-gray-800"
            variants={itemVariants}
          >
            Notifications
          </motion.h1>
          
          <motion.div 
            className="flex flex-wrap gap-2 mt-4 md:mt-0"
            variants={itemVariants}
          >
            <button
              onClick={markAllAsRead}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1 text-sm"
            >
              <FiCheck /> Mark all as read
            </button>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="px-3 py-1.5 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center gap-1 text-sm"
            >
              <FiFilter /> Filter
            </button>
          </motion.div>
        </div>
        
        {/* Filter dropdown */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div 
              className="bg-white rounded-lg shadow-md p-4 mb-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-medium text-gray-700 mb-3">Filter by Type</h3>
              <div className="flex flex-wrap gap-3">
                {Object.keys(filters).map(type => (
                  <label key={type} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters[type]}
                      onChange={() => 
                        setFilters(prev => ({ ...prev, [type]: !prev[type] }))
                      }
                      className="sr-only"
                    />
                    <div className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 ${
                      filters[type] 
                        ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                        : 'bg-gray-100 text-gray-500 border border-gray-200'
                    }`}>
                      {type === 'system' && <FiBell />}
                      {type === 'academic' && <FiBookOpen />}
                      {type === 'payment' && <MdPayment />}
                      {type === 'message' && <FiMail />}
                      {type === 'calendar' && <FiCalendar />}
                      <span className="capitalize">{type}</span>
                    </div>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Tabs */}
        <motion.div 
          className="bg-white rounded-lg shadow-md mb-6 p-1 flex"
          variants={itemVariants}
        >
          <button
            className={`flex items-center px-4 py-2 rounded-md ${
              activeTab === 'all'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            } transition-colors duration-200 flex-1 justify-center`}
            onClick={() => setActiveTab('all')}
          >
            All <span className="ml-2 bg-gray-200 px-1.5 py-0.5 rounded-full text-xs">{notifications.length}</span>
          </button>
          <button
            className={`flex items-center px-4 py-2 rounded-md ${
              activeTab === 'unread'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            } transition-colors duration-200 flex-1 justify-center`}
            onClick={() => setActiveTab('unread')}
          >
            Unread <span className="ml-2 bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full text-xs">{unreadCount}</span>
          </button>
          <button
            className={`flex items-center px-4 py-2 rounded-md ${
              activeTab === 'read'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            } transition-colors duration-200 flex-1 justify-center`}
            onClick={() => setActiveTab('read')}
          >
            Read <span className="ml-2 bg-gray-200 px-1.5 py-0.5 rounded-full text-xs">{readCount}</span>
          </button>
        </motion.div>
        
        {/* Loading spinner */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No notifications found
          </div>
        ) : (
          <motion.div variants={containerVariants}>
            <div className="space-y-4">
              {filteredNotifications.map(notification => (
                <motion.div 
                  key={notification.id}
                  className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${
                    notification.read ? 'border-gray-300' : `border-blue-500`
                  }`}
                  variants={itemVariants}
                >
                  <div className="p-4 flex">
                    <div className="flex-shrink-0 mr-4 mt-1">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className={`font-medium ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                          {notification.title}
                        </h3>
                        <span className="text-xs text-gray-500">{formatDate(notification.timestamp)}</span>
                      </div>
                      <p className={`text-sm mt-1 ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                        {notification.message}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => toggleRead(notification.id)}
                          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <FiCheck className="text-xs" />
                          {notification.read ? 'Mark as unread' : 'Mark as read'}
                        </button>
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                          <FiTrash2 className="text-xs" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Notificationpage;