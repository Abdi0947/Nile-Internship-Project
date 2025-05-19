const User = require("../model/Usermodel");
const bcrypt = require("bcryptjs");
const generateToken = require("../lib/Tokengenerator");
const Cloudinary = require("../lib/Cloudinary");
const crypto = require("crypto");
const sendEmail = require("../lib/email");

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

    const welcomeHTML = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
    <h2 style="color: #4f46e5;">Welcome to Our Platform!</h2>
    <p style="color: #333;">Hi there,</p>
    <p style="color: #333;">We're excited to have you on board. Feel free to explore and enjoy the features we offer.</p>
    <a href="http://localhost:5173/" 
       style="display: inline-block; margin-top: 20px; background-color: #4f46e5; color: white; padding: 12px 20px; border-radius: 5px; text-decoration: none;">
      Get Started
    </a>
    <p style="margin-top: 20px; color: #999; font-size: 12px;">If you didn't create this account, please ignore this message.</p>
  </div>
`;
    const message = "Welcom To School Mangement System!"
    await sendEmail({
      email: savedUser.email,
      subject: "🎉 Welcome to Our App!",
      message,
      html: welcomeHTML,
    });

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
    // 1) Get user based on POSTED email from the body / the email that we wnat the password to reset
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "There is no user with that email address.",
      });
    }

    // 2) Generate the random reset token
    const token = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = token;
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email / via gmail / check in Spam sometimes it is sent to Spam
    const resetURL = `http://localhost:5173/reset-password/${token}`;

    const message = `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hello,</p>
        <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
        <p>To reset your password, click the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetURL}" 
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetURL}</p>
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply to this email.</p>
      </div>
    `;

    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
      html: htmlMessage,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    // If there's an error, reset the token fields
    if (err.user) {
      err.user.passwordResetToken = undefined;
      err.user.passwordResetExpires = undefined;
      await err.user.save({ validateBeforeSave: false });
    }

    res.status(500).json({
      status: "error",
      message: "There was an error sending the email. Try again later!",
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
