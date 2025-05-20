const User = require("../model/Usermodel");
const bcrypt = require("bcryptjs");
const generateToken = require("../lib/Tokengenerator");
const Cloudinary = require("../lib/Cloudinary");
const crypto = require("crypto");
const sendEmail = require("../lib/email");

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

    const validRoles = [
      "Teacher",
      "Manager",
      "Admin",
      "Student",
      "teacher",
      "manager",
      "admin",
      "student",
      "administrative",
    ];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        error:
          "The role should be one of: Teacher/teacher, Manager/manager, Admin/admin, or Student/student",
      });
    }

    const duplicatedUser = await User.findOne({ email });
    if (duplicatedUser) {
      return res.status(400).json({ error: "User already exists" });
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
    });

    const savedUser = await newUser.save();
    const token = await generateToken(savedUser, res);

    // Send welcome email
    try {
      await sendEmail({
        email: savedUser.email,
        subject: "Welcome to Student Management System! 🎓",
        message: `Welcome ${savedUser.firstName}! Your account has been successfully created.`,
        html: getWelcomeEmailTemplate(savedUser)
      });
    } catch (emailError) {
      console.error("Welcome email sending failed:", emailError);
      // Don't fail the signup if email fails
    }

    res.status(201).json({
      message: "Signup successful",
      savedUser: {
        id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        role: savedUser.role,
        ProfilePic: savedUser.ProfilePic,
        token,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(400).json({ error: "Error during signup: " + error.message });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("[Auth Debug] Login attempt for:", email);

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const duplicatedUser = await User.findOne({ email });

    if (!duplicatedUser) {
      console.log("[Auth Debug] No user found with email:", email);
      return res.status(400).json({ error: "No user found with this email" });
    }

    console.log(
      "[Auth Debug] User found:",
      duplicatedUser.email,
      "Role:",
      duplicatedUser.role
    );

    const hasedpassword = await bcrypt.compare(
      password,
      duplicatedUser.password
    );

    console.log("[Auth Debug] Password match:", hasedpassword);

    if (!hasedpassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = await generateToken(duplicatedUser, res);
    console.log("[Auth Debug] Login successful, token generated");

    return res.status(200).json({
      message: "login successful",
      user: {
        id: duplicatedUser.id,
        firstName: duplicatedUser.firstName,
        lastName: duplicatedUser.lastName,
        email: duplicatedUser.email,
        role: duplicatedUser.role,
        ProfilePic: duplicatedUser.ProfilePic,
        token,
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
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "There is no user with that email address.",
      });
    }

    // Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetURL = `http://localhost:5173/reset-password/${resetToken}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Request - Student Management System",
        message: `To reset your password, please click this link: ${resetURL}`,
        html: getPasswordResetEmailTemplate(user, resetURL)
      });

      res.status(200).json({
        status: "success",
        message: "Password reset instructions sent to your email!",
      });
    } catch (emailError) {
      // If email sending fails, reset the token
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      console.error("Password reset email sending failed:", emailError);
      return res.status(500).json({
        status: "error",
        message: "There was an error sending the email. Please try again later.",
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

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Token is invalid or has expired",
      });
    }
    const hashed = await bcrypt.hash(req.body.password, 10);

    user.password = hashed;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

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
