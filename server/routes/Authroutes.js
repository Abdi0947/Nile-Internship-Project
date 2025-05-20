const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  logout,
  updateProfile,
  ForgotPassword,
  ResetPassword,
  updateUserInfo,
  approveTeacher,
  getPendingTeachers
} = require("../controller/Authcontroller");
const { protect, restrictTo, authmiddleware } = require("../middleware/Authmiddleware");

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", ForgotPassword);
router.post("/reset-password/:tokens", ResetPassword);

// Protected routes
router.use(protect); // All routes after this middleware require authentication

// Teacher approval routes (admin only)
router.get("/pending-teachers", restrictTo("Admin"), getPendingTeachers);
router.post("/approve-teacher", restrictTo("Admin"), approveTeacher);

// User routes
router.patch("/update-profile", authmiddleware, updateProfile);
router.patch("/update-user-info", authmiddleware, updateUserInfo);

module.exports = router; 