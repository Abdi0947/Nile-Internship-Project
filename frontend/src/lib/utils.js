/**
 * Utility functions for authentication and general use
 */

/**
 * Safely gets authenticated user data from localStorage
 * @returns {Object|null} User data or null if not available
 */
export const getSafeUserData = () => {
  try {
    // Check if we should use sessionStorage (not remembered) or localStorage (remembered)
    const storage = getRememberMePreference() ? localStorage : sessionStorage;
    const userData = storage.getItem('user');
    if (!userData) return null;
    
    const parsedData = JSON.parse(userData);
    
    // Add timestamp to ProfilePic URL to avoid caching issues
    if (parsedData && parsedData.ProfilePic) {
      const timestamp = Date.now();
      // Only add timestamp if it doesn't already have one
      if (!parsedData.ProfilePic.includes('?t=')) {
        parsedData.ProfilePic = `${parsedData.ProfilePic}?t=${timestamp}`;
      }
    }
    
    return parsedData;
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    // Clear invalid data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    return null;
  }
};

/**
 * Safely stores user data in localStorage or sessionStorage based on remember me preference
 * @param {Object} userData User data to store
 * @param {boolean} rememberMe Whether to remember the user across browser sessions
 * @returns {boolean} Success status
 */
export const storeUserData = (userData, rememberMe = false) => {
  try {
    console.log('storeUserData called with rememberMe:', rememberMe);
    
    if (!userData) {
      console.error('Attempted to store empty user data');
      return false;
    }
    
    // Create a copy to avoid modifying the original object
    const userDataToStore = { ...userData };
    
    // Make sure we're not losing any ProfilePic data
    const existingUserData = getSafeUserData();
    if (!userDataToStore.ProfilePic && existingUserData?.ProfilePic) {
      console.log('Preserving existing ProfilePic in localStorage');
      userDataToStore.ProfilePic = existingUserData.ProfilePic;
    }
    
    // Store remember me preference
    setRememberMePreference(rememberMe);
    
    // Use appropriate storage based on remember me preference
    const storage = rememberMe ? localStorage : sessionStorage;
    console.log('Using storage:', rememberMe ? 'localStorage' : 'sessionStorage');
    
    // Store user data in storage
    storage.setItem(
      "user",
      JSON.stringify({
        role: userData?.role,
        id: userData?.id || userData?._id,
      })
    );
    
    // Store token separately if provided
    if (userDataToStore.token) {
      storage.setItem('token', userDataToStore.token);
    }
    
    console.log('User data stored successfully:', userDataToStore);
    return true;
  } catch (error) {
    console.error('Error storing user data in storage:', error);
    return false;
  }
};

/**
 * Sets the remember me preference
 * @param {boolean} remember Whether to remember the user
 */
export const setRememberMePreference = (remember) => {
  console.log('Setting rememberMe preference to:', remember);
  localStorage.setItem('rememberMe', remember ? 'true' : 'false');
};

/**
 * Gets the remember me preference
 * @returns {boolean} Whether to remember the user
 */
export const getRememberMePreference = () => {
  const rememberMeValue = localStorage.getItem('rememberMe');
  // Explicitly check for the string 'true', otherwise return false
  const result = rememberMeValue === 'true';
  console.log('getRememberMePreference called, value from storage:', rememberMeValue, 'returning:', result);
  return result;
};

/**
 * Clears all auth-related data from localStorage and sessionStorage
 */
export const clearAuthData = () => {
  console.log('Clearing auth data');
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('authUser');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('token');
  console.log('Auth data cleared, rememberMe preference preserved');
  // Don't clear rememberMe preference
};

/**
 * Normalizes role strings for consistent comparison
 * @param {string} role Role string to normalize
 * @returns {string} Normalized role
 */
export const normalizeRole = (role) => {
  if (!role || typeof role !== 'string') return '';
  
  const roleStr = role.toLowerCase().trim();
  
  if (['admin', 'administrator'].includes(roleStr)) return 'admin';
  if (['manager', 'administrative'].includes(roleStr)) return 'manager';
  if (['teacher', 'instructor', 'faculty'].includes(roleStr)) return 'teacher';
  if (['student', 'learner', 'pupil'].includes(roleStr)) return 'student';
  
  return roleStr;
};

/**
 * Gets redirect path based on user role
 * @param {string} role User role
 * @returns {string} Path to redirect to
 */
export const getRedirectPathByRole = (role) => {
  const normalizedRole = normalizeRole(role);
  
  switch (normalizedRole) {
    case 'admin':
      return '/admin/home';
    case 'teacher':
      return '/teacher/home';
    case 'student':
      return '/student/home';
    case 'manager':
      return '/admin/home';
    default:
      return '/';
  }
}; 