import { configureStore } from "@reduxjs/toolkit";
import attendanceReducer from "../features/Attendance";
import TeacherReducer from "../features/Teacher"
import TimetableReducer from "../features/TimeTable"
import authReducer from "../features/Authentication"
import FeeReducer from "../features/Fee"
import StudentReducer from "../features/Student"
import SubjectReducer from "../features/Subject"
import GradeReducer from "../features/Grade"
import AssignmentReducer from '../features/Assignment'
import ClassReducer from '../features/Class'
import NotificationReducer from "../features/Notification"
import { ensureProfileImagePersistence } from "../lib/sessionPersistence";

// Custom middleware to preserve profile images
const profilePersistenceMiddleware = store => next => action => {
  // Call the next dispatch method in the middleware chain
  const result = next(action);
  
  // Get the current state after the action has been processed
  const state = store.getState();
  
  // If this is an auth-related action that might affect the profile image, cache it
  if (action.type.startsWith('auth/') && state.auth.Authuser?.ProfilePic) {
    // Log the action that's affecting the profile image
    console.log('Auth action detected:', action.type);
    console.log('Current profile image:', state.auth.Authuser.ProfilePic);

    // Cache the profile image in session storage
    try {
      const cleanProfilePic = state.auth.Authuser.ProfilePic.split('?')[0];
      sessionStorage.setItem('cachedProfileImage', cleanProfilePic);
      sessionStorage.setItem('profileImageTimestamp', Date.now().toString());
    } catch (err) {
      console.error('Error caching profile image in middleware:', err);
    }
  }
  
  return result;
};

const store = configureStore({
  reducer: {
    attendance: attendanceReducer,
    Teacher: TeacherReducer,
    Timetables: TimetableReducer,
    auth: authReducer,
    Fee: FeeReducer,
    Student: StudentReducer,
    notification: NotificationReducer,
    Subject: SubjectReducer,
    Grade: GradeReducer,
    Assignment: AssignmentReducer,
    Class: ClassReducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware()
      .concat(profilePersistenceMiddleware),
  // This ensures that when the store is created, any cached profile image is used
  preloadedState: ensureProfileImagePersistence(undefined)
});

export default store;