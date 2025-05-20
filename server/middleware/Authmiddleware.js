const jwt = require("jsonwebtoken");
const User = require("../model/Usermodel");
require('dotenv').config();

// Protect routes - verify token
const protect = async (req, res, next) => {
  try {
    // 1) Get token from cookie
    const token = req.cookies.Schoolmanagmentsystem;

    if (!token) {
      return res.status(401).json({
        error: "You are not logged in. Please log in to get access.",
      });
    }

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        error: "The user belonging to this token no longer exists.",
      });
    }

    // 4) Check if user is a teacher and if their account is approved
    if (user.role.toLowerCase() === "teacher" && user.approvalStatus !== "approved") {
      return res.status(403).json({
        error: user.approvalStatus === "pending"
          ? "Your account is pending approval. Please wait for admin approval."
          : "Your account has been rejected. Please contact the administration.",
      });
    }

    // Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Invalid token. Please log in again.",
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Your token has expired. Please log in again.",
      });
    }
    return res.status(401).json({
      error: "Authentication failed. Please log in again.",
    });
  }
};

// Restrict access to certain roles
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.map(role => role.toLowerCase()).includes(req.user.role.toLowerCase())) {
      return res.status(403).json({
        error: "You do not have permission to perform this action",
      });
    }
    next();
  };
};

// Role-specific middleware
const Adminmiddleware = async (req, res, next) => {
  const user = req.user;
  try {
    if (!user) {
      return res.status(403).json({ message: "Access denied." });
    }

    if (user.role.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin role required." });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token." });
  }
};

const Managermiddleware = async (req, res, next) => {
  const user = req.user;
  try {
    if (!user) {
      return res.status(403).json({ message: "Access denied." });
    }

    if (user.role.toLowerCase() !== "manager") {
      return res.status(403).json({ message: "Access denied. Manager role required." });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token." });
  }
};

const Teachermiddleware = async (req, res, next) => {
  const user = req.user;
  try {
    if (!user) {
      return res.status(403).json({ message: "Access denied." });
    }

    if (user.role.toLowerCase() !== "teacher") {
      return res.status(403).json({ message: "Access denied. Teacher role required." });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token." });
  }
};

const Studentmiddleware = async (req, res, next) => {
  const user = req.user;
  try {
    if (!user) {
      return res.status(403).json({ message: "Access denied." });
    }

    if (user.role.toLowerCase() !== "student") {
      return res.status(403).json({ message: "Access denied. Student role required." });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token." });
  }
};

// Export all middleware functions
module.exports = {
  protect,
  restrictTo,
  Adminmiddleware,
  Managermiddleware,
  Teachermiddleware,
  Studentmiddleware,
  // For backward compatibility
  authmiddleware: protect
};