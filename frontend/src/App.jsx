import './index.css'; 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Landingpage from './pages/Landingpage';
import Teacherpage from './pages/Teacherpage';
import TeacherDashboardpage from './pages/TeacherDashboardpage'; 
import TeacherAccountdetail from './pages/TeacherAccountdetail';
import Notificationpage from './pages/Notificationpage';
import TeacherSubject from './pages/TeacherSubject'
import Register from './pages/Register';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard'
import Attendancepage from './pages/Attendancepage'
import Timetable from './pages/Timetable';
import toast, { Toaster } from 'react-hot-toast';
import { AdminTeacher } from './pages/AdminTeacher';
import Adminpage from './pages/Adminpage'
import TimeTable from './features/TimeTable';
import TeachersAssignmentpage from "./pages/TeachersAssignmentpage"
import TeacherClass from "./pages/TeacherClass"
import FeePage from './pages/FeePage';
import StudentManagement from './pages/StudentManagement';
import AccountSettings from './pages/AccountSettings';
import StudentDashboard from './pages/StudentDashboard';
import StudentCourses from './pages/StudentCourses';
import StudentGradeReport from './pages/StudentGradeReport';
import StudentReviewPage from './pages/StudentReviewPage';
import AssignmentDetailsPage from './pages/AssignmentDetailsPage';
import TeacherReviewPage from './pages/TeacherReviewPage';
import AssignmentReviewPage from './pages/AssignmentReviewPage';
import { initializeProfileImage } from './lib/profileImageUtils';
import { updateUserInfo } from './features/Authentication';
import { DarkModeProvider } from './context/DarkModeContext';
import AddTeacherPage from './pages/AddTeacher';
import StudentAssignmentDetails from './pages/StudentAssignmentDetails';
import StudentAssignmentSubmit from './pages/StudentAssignmentSubmit';
import StudentCourseAssignments from './pages/StudentCourseAssignments';
import StudentCourseDetails from './pages/StudentCourseDetails';
import StudentLayout from './layouts/StudentLayout';
import AssignmentDetails from './pages/AssignmentDetails';
import SubmitAssignment from './pages/SubmitAssignment';
import TeacherGradeAssignment from './pages/TeacherGradeAssignment';
import TeacherGradeSubmission from './pages/TeacherGradeSubmission';
import TeacherRequestPage from './pages/TeacherRequestPage';

function App() {
  const dispatch = useDispatch();
  const { Authuser } = useSelector((state) => state.auth);

  // Initialize profile image on app load
  useEffect(() => {
    if (Authuser) {
      console.log('App mounted with authenticated user, initializing profile image');
      initializeProfileImage(dispatch, updateUserInfo);
    }
  }, []);

  // Ensure profile image persistence when user or profile changes
  useEffect(() => {
    if (Authuser?.ProfilePic) {
      console.log('User profile updated, ensuring image persistence');
      
      // Store image in localStorage to ensure it persists
      localStorage.setItem('profileImage', Authuser.ProfilePic);
      
      // Update timestamp to help with cache busting
      localStorage.setItem('profileImageTimestamp', Date.now().toString());
    }
  }, [Authuser?.ProfilePic]);

  // Ensure the user object always has the latest ProfilePic
  useEffect(() => {
    if (Authuser) {
      const savedImage = localStorage.getItem('profileImage');
      const currentUserStr = localStorage.getItem('user');
      
      if (savedImage && currentUserStr) {
        try {
          const currentUser = JSON.parse(currentUserStr);
          
          // Check if localStorage user's profile pic doesn't match the saved image
          if (currentUser.ProfilePic !== savedImage) {
            console.log('Synchronizing profile image with user data');
            const updatedUser = { ...currentUser, ProfilePic: savedImage };
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
        } catch (error) {
          console.error('Error synchronizing profile image:', error);
        }
      }
    }
  }, [Authuser]);

  return (
    <DarkModeProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Landingpage />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/logout' element={<Navigate to="/login" replace />} />
          
          <Route path='/teacher' element={<Teacherpage />}>
            <Route path='home' element={<TeacherDashboardpage />} />
            <Route path='dashboard' element={<TeacherDashboardpage />} />
            <Route path='account' element={<AccountSettings />} />
            <Route path='settings' element={<AccountSettings />} />
            <Route path='timetable' element={<Timetable />} />
            <Route path='TeachersAssignmentpage' element={<TeachersAssignmentpage />} />
            <Route path='TeachersAssignmentpage/:assignmentId' element={<AssignmentReviewPage />} />
            <Route path='grade-assignments' element={<TeacherGradeAssignment />} />
            <Route path='grade-assignments/:assignmentId' element={<TeacherGradeSubmission />} />
            <Route path='notifications' element={<Notificationpage />} />
            <Route path='Attendancepage' element={<Attendancepage/>}/>
            <Route path='TeacherSubject' element={<TeacherSubject/>}/>
            <Route path='classes' element={<TeacherClass/>}/>
            <Route path='assignment/:assignmentId' element={<AssignmentDetailsPage />} />
            <Route path='review/:teacherId' element={<TeacherReviewPage />} />
          </Route>

          <Route path='/Admin' element={<Adminpage/>}>
            <Route path='home' element={<AdminDashboard />} />
            <Route index element={<AdminDashboard />} />
            <Route path='admindashboard' element={<AdminDashboard />} />
            <Route path='AdminTeacher' element={<AdminTeacher/>} />
            <Route path='teacher-requests' element={<TeacherRequestPage />} />
            <Route path='Timetable' element={<Timetable/>} />
            <Route path='fee' element={<FeePage/>} />
            <Route path='students' element={<StudentManagement/>} />
            <Route path='account' element={<AccountSettings />} />
            <Route path='settings' element={<AccountSettings />} />
            <Route path='notifications' element={<Notificationpage />} />
            <Route path='student/:studentId' element={<StudentReviewPage />} />
            <Route path='teacher/:teacherId' element={<TeacherReviewPage />} />
          </Route>

          <Route path='/student' element={<StudentLayout />}>
            <Route path='home' element={<StudentDashboard />} />
            <Route path='dashboard' element={<StudentDashboard />} />
            <Route path='courses' element={<StudentCourses />} />
            <Route path='assignments' element={<StudentAssignmentDetails />} />
            <Route path='grades' element={<StudentGradeReport />} />
            <Route path='timetable' element={<Timetable />} />
            <Route path='account' element={<AccountSettings />} />
            <Route path='settings' element={<AccountSettings />} />
            <Route path='notifications' element={<Notificationpage />} />
            <Route path='assignments/:id' element={<AssignmentDetails />} />
            <Route path='assignments/:id/submit' element={<SubmitAssignment />} />
          </Route>

          {/* Add route for adding a teacher */}
          <Route path='/admin/teachers/add' element={<AddTeacherPage />} />
        </Routes>

        <Toaster />
      </Router>
    </DarkModeProvider>
  );
}

export default App;
