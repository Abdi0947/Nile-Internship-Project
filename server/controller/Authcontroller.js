const User = require("../model/Usermodel");
const { OAuth2Client } = require("google-auth-library");
const Teacher = require("../model/Teachermodel");
const Student = require("../model/Studentmodel");
const bcrypt = require("bcryptjs");
const generateToken = require("../lib/Tokengenerator");
const Cloudinary = require("../lib/Cloudinary");
const crypto = require("crypto");
const sendEmail = require("../lib/email");
require("dotenv").config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Add this email template function at the top of the file
const getWelcomeEmailTemplate = (user) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Student Management System</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%); padding: 30px; text-align: center; color: white; }
        .content { padding: 20px; background: #f9fafb; }
        .button { display: inline-block; padding: 12px 24px; background: #4ade80; color: white; text-decoration: none; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Student Management System! 🎓</h1>
        </div>
        <div class="content">
            <h2>Hello ${user.firstName} ${user.lastName},</h2>
            <p>Welcome to our platform! We're excited to have you join our community.</p>
            <p>Your account has been successfully created with the following details:</p>
            <ul>
                <li>Email: ${user.email}</li>
                <li>Role: ${user.role}</li>
                <li>Account Created: ${new Date().toLocaleDateString()}</li>
            </ul>
            <p>To get started, please click the button below:</p>
            <p style="text-align: center;">
                <a href="http://localhost:5173/login" class="button">Login to Your Account</a>
            </p>
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        </div>
        <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>© ${new Date().getFullYear()} Student Management System. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

const getPasswordResetEmailTemplate = (user, resetURL) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%); padding: 30px; text-align: center; color: white; }
        .content { padding: 20px; background: #f9fafb; }
        .button { display: inline-block; padding: 12px 24px; background: #4ade80; color: white; text-decoration: none; border-radius: 5px; }
        .warning { background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Request 🔐</h1>
        </div>
        <div class="content">
            <h2>Hello ${user.firstName},</h2>
            <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
            <p>To reset your password, click the button below:</p>
            <p style="text-align: center;">
                <a href="${resetURL}" class="button">Reset Password</a>
            </p>
            <div class="warning">
                <p><strong>Important:</strong> This password reset link will expire in 10 minutes.</p>
            </div>
            <p>If the button above doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all;">${resetURL}</p>
        </div>
        <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>© ${new Date().getFullYear()} Student Management System. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

module.exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, ProfilePic } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
      return res
        .status(400)
        .json({ error: "Please provide all neccessary information" });
    }

    // Try to find the user in all collections
    const user = await User.findOne({ email });
    const teacher = await Teacher.findOne({ email });
    const student = await Student.findOne({ email });

    let foundUser;
    if (student) {
      foundUser = student;
    } else if (teacher) {
      foundUser = teacher;
    } else if (user) {
      foundUser = user;
    }

    if (foundUser) {
      return res
        .status(400)
        .json({ error: "User already exist with this email!" });
    }

    const validRoles = ["Admin", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        error: "The role should be one of: Admin",
      });
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    let profilePicUrl = "";

    // Upload profile picture to Cloudinary if provided
    if (ProfilePic) {
      try {
        // Check if Cloudinary is properly configured
        const isCloudinaryConfigured =
          process.env.CLOUD_NAME &&
          process.env.CLOUD_NAME !== "your_cloud_name" &&
          process.env.API_KEY &&
          process.env.API_KEY !== "your_cloudinary_api_key" &&
          process.env.API_SECRET &&
          process.env.API_SECRET !== "your_cloudinary_api_secret";

        if (isCloudinaryConfigured) {
          // Use Cloudinary if properly configured
          const uploadResponse = await Cloudinary.uploader.upload(ProfilePic, {
            folder: "profile_school_managment_system",
            upload_preset: "upload",
          });
          console.log(uploadResponse);
          profilePicUrl = uploadResponse.secure_url;
        } else {
          // Fallback for local development - store image data directly
          console.log(
            "Cloudinary not configured correctly - using direct image data"
          );
          profilePicUrl = ProfilePic;
        }
      } catch (cloudinaryError) {
        console.error("Cloudinary upload failed:", cloudinaryError);
        // Continue with data URL as profile pic if upload fails
        if (ProfilePic.startsWith("data:image")) {
          profilePicUrl = ProfilePic;
        }
      }
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedpassword,
      ProfilePic: profilePicUrl,
      role,
      // approvalStatus will be set by the schema default
    });

    const savedUser = await newUser.save();
    const token = await generateToken(savedUser, res);

    await sendEmail({
      email: savedUser.email,
      subject: "Welcome to Student Management System! 🎓",
      message: `Welcome ${savedUser.firstName}! Your account has been successfully created.`,
      html: getWelcomeEmailTemplate(savedUser),
    });
    res.status(201).json({
      message: "Signup successful",
      user: {
        id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        role: savedUser.role,
        ProfilePic: savedUser.ProfilePic,
        approvalStatus: savedUser.approvalStatus,
        token,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(400).json({ error: "Error during signup: " + error.message });
  }
};

module.exports.googleLogin = async (req, res) => {
  console.log(req.body);
  const { token } = req.body;

  try {
    if (!token) {
      return res.status(400).json({ error: "Google token missing" });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    console.log("[Google Login] Verifying token for:", email);

    // Try to find the user in all collections
    const user = await User.findOne({ email });
    const teacher = await Teacher.findOne({ email });
    const student = await Student.findOne({ email });

    let foundUser;
    if (student) {
      foundUser = student;
    } else if (teacher) {
      foundUser = teacher;
    } else if (user) {
      foundUser = user;
    }

    if (!foundUser) {
      return res.status(404).json({
        error:
          "No account associated with this Google account. Please sign up first.",
      });
    }

    const tokenGenerated = await generateToken(foundUser, res);

    return res.status(200).json({
      message: "Google login successful",
      user: {
        id: foundUser._id,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        email: foundUser.email,
        role: foundUser.role,
        ProfilePic: foundUser.ProfilePic,
        approvalStatus: foundUser.approvalStatus,
        token: tokenGenerated,
        ...(foundUser.phone && { phone: foundUser.phone }),
        ...(foundUser.Address && { address: foundUser.Address }),
        ...(foundUser.subjects && { subject: foundUser.subjects }),
        ...(foundUser.classId && { classId: foundUser.classId }),
      },
    });
  } catch (error) {
    console.error("[Google Login Error]:", error.message);
    return res
      .status(500)
      .json({ error: "Google login failed: " + error.message });
  }
};
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("[Auth Debug] Login attempt for:", email);

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    const teacher = await Teacher.findOne({ email });
    const student = await Student.findOne({ email });

    let foundUser;
    if (student) {
      foundUser = student;
    } else if (teacher) {
      foundUser = teacher;
    } else if (user) {
      foundUser = user;
    }

    if (!foundUser) {
      return res.status(404).json({
        error: "No account associated with this account. Please sign up first.",
      });
    }
    const isMatch = await bcrypt.compare(password, foundUser.password);

    if (!isMatch) {
      return res.status(404).json({
        error: "Incorrect password!",
      });
    }

    const tokenGenerated = await generateToken(foundUser, res);
    

    return res.status(200).json({
      message: "Google login successful",
      user: {
        id: foundUser._id,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        email: foundUser.email,
        role: foundUser.role,
        ProfilePic: foundUser.ProfilePic,
        approvalStatus: foundUser.approvalStatus,
        token: tokenGenerated,
        ...(foundUser.phone && { phone: foundUser.phone }),
        ...(foundUser.Address && { address: foundUser.Address }),
        ...(foundUser.subjects && { subject: foundUser.subjects }),
        ...(foundUser.classId && { classId: foundUser.classId }),
      },
    });
  } catch (error) {
    console.error("[Auth Debug] Login error:", error);
    res.status(400).json({
      error: "Error in login: " + error.message,
    });
  }
};

module.exports.logout = async (req, res) => {
  try {
    res.cookie("Schoolmanagmentsystem", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred during logout. Please try again.",
      error: error.message,
    });
  }
};

module.exports.updateProfile = async (req, res) => {
  try {
    const { ProfilePic } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    if (ProfilePic) {
      try {
        console.log("Processing profile image upload...");

        // Check if Cloudinary is properly configured
        const isCloudinaryConfigured =
          process.env.CLOUD_NAME &&
          process.env.CLOUD_NAME !== "your_cloud_name" &&
          process.env.API_KEY &&
          process.env.API_KEY !== "your_cloudinary_api_key" &&
          process.env.API_SECRET &&
          process.env.API_SECRET !== "your_cloudinary_api_secret";

        let imageUrl = "";

        if (isCloudinaryConfigured) {
          // Use Cloudinary if properly configured
          const uploadResponse = await Cloudinary.uploader.upload(ProfilePic, {
            folder: "profile_school_managment_system",
            transformation: [{ quality: "auto" }],
            fetch_format: "auto",
          });

          imageUrl = uploadResponse.secure_url;
          console.log("Image uploaded to Cloudinary:", imageUrl);
        } else {
          // Fallback for local development - store image in user session
          console.log(
            "Cloudinary not configured correctly - using direct image data"
          );
          // Store the image data directly temporarily (not ideal for production)
          imageUrl = ProfilePic;
        }

        // Add a unique identifier to prevent caching issues
        const timestampedUrl = imageUrl.includes("?")
          ? `${imageUrl}&t=${Date.now()}`
          : `${imageUrl}?t=${Date.now()}`;

        const updatedUser = await User.findOneAndUpdate(
          { _id: userId },
          { ProfilePic: imageUrl }, // Store the URL in DB
          { new: true }
        ).select("-password"); // Exclude password from response

        if (!updatedUser) {
          return res.status(404).json({ message: "User not found" });
        }

        console.log("User profile updated successfully");

        return res.status(200).json({
          message: "Profile updated successfully",
          updatedUser: {
            ...updatedUser.toObject(),
            ProfilePic: timestampedUrl, // Send back timestamped URL to client
          },
        });
      } catch (cloudinaryError) {
        console.error("Cloudinary upload failed:", cloudinaryError);

        // Provide more specific error message
        let errorMessage = "Image upload failed";
        if (
          cloudinaryError.message &&
          cloudinaryError.message.includes("Unknown API key")
        ) {
          errorMessage =
            "Cloudinary credentials not configured. Please update your .env file with valid Cloudinary credentials.";
        }

        return res.status(500).json({
          message: errorMessage,
          error: cloudinaryError.message,
        });
      }
    } else {
      return res.status(400).json({ message: "No profile picture provided" });
    }
  } catch (error) {
    console.error("Error in update profile Controller", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports.ForgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    const teacher = await Teacher.findOne({ email });
    const student = await Student.findOne({ email });

    let foundUser;
    if (student) {
      foundUser = student;
    } else if (teacher) {
      foundUser = teacher;
    } else if (user) {
      foundUser = user;
    }

    if (!foundUser) {
      return res.status(404).json({
        error: "No account associated with this account. Please sign up first.",
      });
    }

    // Generate reset token
    const tokens = crypto.randomBytes(32).toString("hex");
    foundUser.passwordResetToken = tokens;
    foundUser.passwordResetExpires = Date.now() + 3600000; // 1 hour
    await foundUser.save({ validateBeforeSave: false });

    // Create reset URL
    const resetURL = `http://localhost:5173/reset-password/${tokens}`;

    try {
      await sendEmail({
        email: foundUser.email,
        subject: "Password Reset Request - Student Management System",
        message: `To reset your password, please click this link: ${resetURL}`,
        html: getPasswordResetEmailTemplate(foundUser, resetURL),
      });

      res.status(200).json({
        status: "success",
        message: "Password reset instructions sent to your email!",
      });
    } catch (emailError) {
      // If email sending fails, reset the token
      foundUser.passwordResetToken = undefined;
      foundUser.passwordResetExpires = undefined;
      await foundUser.save({ validateBeforeSave: false });

      console.error("Password reset email sending failed:", emailError);
      return res.status(500).json({
        status: "error",
        message:
          "There was an error sending the email. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred. Please try again later.",
    });
  }
};

module.exports.ResetPassword = async (req, res) => {
  try {
    const { tokens } = req.params;

    
    const user = await User.findOne({
      passwordResetToken: tokens,
      passwordResetExpires: { $gt: Date.now() },
    });
    const teacher = await Teacher.findOne({
      passwordResetToken: tokens,
      passwordResetExpires: { $gt: Date.now() },
    });
    const student = await Student.findOne({
      passwordResetToken: tokens,
      passwordResetExpires: { $gt: Date.now() },
    });

    let foundUser;
    if (student) {
      foundUser = student;
    } else if (teacher) {
      foundUser = teacher;
    } else if (user) {
      foundUser = user;
    }

    if (!foundUser) {
      return res.status(400).json({
        status: "error",
        message: "Token is invalid or has expired",
      });
    }
    const hashed = await bcrypt.hash(req.body.password, 10);

    foundUser.password = hashed;
    foundUser.passwordResetToken = undefined;
    foundUser.passwordResetExpires = undefined;
    await foundUser.save();

    res.status(200).json({
      status: "Password successfully changed!",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error resetting password. Please try again.",
    });
  }
};

module.exports.updateUserInfo = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    // Update the user information
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        email,
        phone,
        address,
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User information updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("Error in updateUserInfo Controller", error.message);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Add new controller for teacher approval
module.exports.approveTeacher = async (req, res) => {
  try {
    const { teacherId, action, rejectionReason } = req.body;
    const adminId = req.user._id;

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ error: "Invalid action" });
    }

    const teacher = await User.findOne({
      _id: teacherId,
      role: { $regex: /^teacher$/i },
    });

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    if (teacher.approvalStatus !== "pending") {
      return res
        .status(400)
        .json({ error: "Teacher account is not pending approval" });
    }

    // Update teacher approval status
    teacher.approvalStatus = action === "approve" ? "approved" : "rejected";
    teacher.approvalDate = new Date();
    teacher.approvedBy = adminId;
    if (action === "reject" && rejectionReason) {
      teacher.rejectionReason = rejectionReason;
    }

    await teacher.save();

    // Send email notification to teacher
    try {
      await sendEmail({
        email: teacher.email,
        subject: `Teacher Account ${
          action === "approve" ? "Approved" : "Rejected"
        }`,
        message: `Your teacher account has been ${
          action === "approve" ? "approved" : "rejected"
        }.`,
        html: getTeacherApprovalEmailTemplate(
          teacher,
          action === "approve",
          rejectionReason
        ),
      });
    } catch (emailError) {
      console.error("Approval email sending failed:", emailError);
      // Continue even if email fails
    }

    res.status(200).json({
      message: `Teacher account ${
        action === "approve" ? "approved" : "rejected"
      } successfully`,
      teacher: {
        id: teacher._id,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        email: teacher.email,
        approvalStatus: teacher.approvalStatus,
        approvalDate: teacher.approvalDate,
      },
    });
  } catch (error) {
    console.error("Error in teacher approval:", error);
    res
      .status(500)
      .json({ error: "Error processing teacher approval: " + error.message });
  }
};

// Add new controller to get pending teachers
module.exports.getPendingTeachers = async (req, res) => {
  try {
    const pendingTeachers = await User.find({
      role: { $regex: /^teacher$/i },
      approvalStatus: "pending",
    }).select("-password");

    res.status(200).json({
      message: "Pending teachers retrieved successfully",
      teachers: pendingTeachers,
    });
  } catch (error) {
    console.error("Error fetching pending teachers:", error);
    res
      .status(500)
      .json({ error: "Error fetching pending teachers: " + error.message });
  }
};
