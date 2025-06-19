const Teacher = require("../model/Teachermodel");
const Student = require("../model/Studentmodel");
const cloudinary = require("../lib/Cloudinary");
const generator = require("generate-password");
const bcrypt = require("bcryptjs");
const User = require("../model/Usermodel");
const Class = require("../model/Classmodel");
const Subject = require("../model/Subjectmodel");
const crypto = require("crypto");
const sendEmail = require("../lib/email");

// Add this email template function at the top of the file
const getWelcomeEmailTemplate = (newTeacher, password) => `
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
            <h2>Hello ${newTeacher.firstName} ${newTeacher.lastName},</h2>
            <p>Welcome to our platform! We're excited to have you join our community.</p>
            <p>Your account has been successfully created with the following details:</p>
            <ul>
                <li>Email: ${newTeacher.email}</li>
                <li>Password: ${password}</li>
                <li>Role: ${newTeacher.role}</li>
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
const passwordChanged = (user) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Changed - Student Management System</title>
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
            <h1>Password Changed Successfully</h1>
        </div>
        <div class="content">
            <h2>Hello ${user.firstName} ${user.lastName},</h2>
            <p>We wanted to let you know that your account password was successfully changed.</p>
            <p>If you made this change, no further action is needed.</p>
            <p>If you did <strong>not</strong> make this change, please reset your password immediately or contact support.</p>
            <ul>
                <li>Email: ${user.email}</li>
                <li>Role: ${user.role}</li>
                <li>Password changed on: ${new Date().toLocaleDateString()}</li>
            </ul>
            <p style="text-align: center;">
                <a href="http://localhost:5173/login" class="button">Login to Your Account</a>
            </p>
        </div>
        <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>© ${new Date().getFullYear()} Student Management System. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

module.exports.createTeacherprofile = async (req, res) => {
  try {
    const {
      Firstname,
      Lastname,
      email,
      phone,
      address,
      dateOfBirth,
      gender,
      profileImage,
      subjects,
      qualification,
      experience,
      attendance,
      assignedClasses,
      Classes,
    } = req.body;
    console.log(phone);

    if (!Firstname || !Lastname) {
      return res
        .status(404)
        .json({ error: "Please provide all necessary information" });
    }

    const user = await User.findOne({ email });
    const student = await Student.findOne({ email });

    let foundUser;
    if (student) {
      foundUser = student;
    } else if (user) {
      foundUser = user;
    }

    if (foundUser) {
      return res
        .status(400)
        .json({ error: "User already exist with this email!" });
    }

    const isTeacher = await Teacher.findOne({ email: email });
    if (isTeacher) {
      return res.status(404).json({ error: "Teacher already registered!" });
    }
    const isSubject = await await Subject.findOne({
      SubjectName: subjects,
    });
    if (isSubject) {
      return res.status(404).json({ error: "Subject already Taken!" });
    }

    let uploadedImageUrl = profileImage;

    // If image is base64 or needs upload
    if (profileImage) {
      try {
        const uploadResponse = await Cloudinary.uploader.upload(profileImage, {
          folder: "profile_school_management_system",
          upload_preset: "upload",
        });

        uploadedImageUrl = uploadResponse.secure_url;

        // Optional: update user model with profile image
        await User.findByIdAndUpdate(
          userId,
          { ProfilePic: uploadedImageUrl },
          { new: true }
        );
      } catch (cloudinaryError) {
        console.error("Cloudinary upload failed:", cloudinaryError);
        return res.status(500).json({
          message: "Image upload failed",
          error: cloudinaryError.message,
        });
      }
    }

    const password = generator.generate({
      length: 8,
      numbers: true,
      symbols: false,
      uppercase: true,
      lowercase: true,
      strict: true, // ensures at least one character from each pool
    });

    console.log(password);
    const hashedpassword = await bcrypt.hash(password, 10);
    const newTeacher = await Teacher.create({
      firstName: Firstname,
      lastName: Lastname,
      email: email,
      password: hashedpassword,
      phone,
      Address: address,
      Dateofbirth: dateOfBirth,
      gender: gender,
      profileImage: profileImage,
      attendance: attendance,
      assignedClasses: assignedClasses,
      qualification: qualification,
      experience: experience,
    });

    // 2. Create the Class without the subject yet
    const oldClass = await Class.findOne({ ClassName: Classes });
    if (!oldClass) {
      const newClass = await Class.create({
        ClassName: Classes,
        teacherId: [newTeacher._id],
        subject: [],
        timetable: [],
      });

      const subject = await Subject.create({
        SubjectName: subjects,
        ClassId: newClass._id,
      });

      newClass.subject.push(subject._id);
      await newClass.save();

      newTeacher.subjects = subject._id;
      await newTeacher.save();

      newTeacher.classId = newClass._id;
      await newTeacher.save();

      return res.status(201).json({
        message: "Teacher profile created successfully",
        teacher: newTeacher,
      });
    }
    console.log(oldClass.teacherId);
    oldClass.teacherId.push(newTeacher._id);
    await oldClass.save();

    const subject = await Subject.create({
      SubjectName: subjects,
      ClassId: oldClass._id,
    });

    oldClass.subject.push(subject._id);
    await oldClass.save();

    newTeacher.subjects = subject._id;
    await newTeacher.save();

    newTeacher.classId = oldClass._id;
    await newTeacher.save();

    await sendEmail({
      email: newTeacher.email,
      subject: "Welcome to Student Management System! 🎓",
      message: `Welcome ${newTeacher.firstName}! Your account has been successfully created.`,
      html: getWelcomeEmailTemplate(newTeacher, password),
    });

    res.status(201).json({
      message: "Teacher profile created successfully",
      teacher: newTeacher,
    });
  } catch (error) {
    console.error("Error during creating teacher profile:", error.message);
    res.status(400).json({
      error: "Error during creating teacher profile: " + error.message,
    });
  }
};

module.exports.getTeacher = async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate("subjects")
      .populate("classId");

    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.getTeacherById = async (req, res) => {
  const { TeacherId } = req.params;
  try {
    const teacher = await Teacher.findById(TeacherId)
      .populate("subjects")
      .populate("classId");

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.updateTeacher = async (req, res) => {
  try {
    const { TeacherId } = req.params;
    const {
      firstName,
      lastName,
      email,
      phone,
      Address,
      Dateofbirth,
      subjects, // This is a subject name (string)
      gender,
      qualification,
      experience,
      status,
      joinDate,
      classId, // This is a class name (string)
    } = req.body;
    console.log(phone);

    // 1️⃣ Check or create Class
    let classDoc = await Class.findOne({ ClassName: classId });
    if (!classDoc) {
      classDoc = await Class.create({
        ClassName: classId,
        teacherId: [TeacherId], // optionally link teacher now
        subject: [],
        timetable: [],
      });
    }

    // 2️⃣ Check or create Subject
    let subjectDoc = await Subject.findOne({
      SubjectName: subjects,
      ClassId: classDoc._id,
    });
    if (!subjectDoc) {
      subjectDoc = await Subject.create({
        SubjectName: subjects,
        ClassId: classDoc._id,
      });

      // Push subject to class document if newly created
      classDoc.subject.push(subjectDoc._id);
      await classDoc.save();
    }
    // 📦 Construct updated data with ObjectIds
    const updatedData = {
      firstName,
      lastName,
      email,
      phone,
      Address,
      Dateofbirth,
      gender,
      qualification,
      status,
      joinDate,
      classId: classDoc._id,
      subjects: subjectDoc._id,
      experience,
    };

    // 🛠️ Update teacher
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      TeacherId,
      updatedData,
      {
        new: true,
      }
    );
    // Make sure subjectDoc._id is an ObjectId
    classDoc.subject = classDoc.subject.filter(
      (sId) => !sId.equals(subjectDoc._id)
    );
    await classDoc.save();

    // Add teacher to newClass if not already there
    if (!classDoc.subject.includes(subjectDoc._id)) {
      classDoc.subject.push(subjectDoc._id);
      await classDoc.save();
    }

    if (!updatedTeacher)
      return res.status(404).json({ message: "Teacher not found" });

    res.status(200).json(updatedTeacher);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error while updating teacher" });
  }
};

module.exports.deleteTeacher = async (req, res) => {
  try {
    const { TeacherId } = req.params;
    const deletedTeacher = await Teacher.findByIdAndDelete(TeacherId);
    let classDoc = await Class.findOne({ teacherId: TeacherId });
    let subjectDoc = await Subject.findByIdAndDelete(deletedTeacher.subjects);
    console.log(subjectDoc._id);
    classDoc.teacherId = classDoc.teacherId.filter(
      (sId) => !sId.equals(TeacherId)
    );
    await classDoc.save();

    classDoc.subject = classDoc.subject.filter(
      (sId) => !sId.equals(subjectDoc._id)
    );
    await classDoc.save();
    if (!classDoc) {
      return res.status(404).json({ error: "Class not found" });
    }

    if (!subjectDoc) {
      return res.status(404).json({ error: "Subject not found" });
    }

    if (!deletedTeacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.searchTeacher = async (req, res) => {
  try {
    const { query } = req.query;
    const teachers = await Teacher.find({
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).populate("subjects assignedClasses attendance");

    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.editProfile = async (req, res) => {
  console.log(req.body);
  console.log(req.params.TeacherId);
  try {
    const { firstName, lastName, email, phone, address } = req.body;
    const oldTeacher = await Teacher.findOne({ _id: req.params.TeacherId });
    oldTeacher.firstName = firstName;
    await oldTeacher.save();

    oldTeacher.lastName = lastName;
    await oldTeacher.save();

    oldTeacher.email = email;
    await oldTeacher.save();

    oldTeacher.phone = phone;
    await oldTeacher.save();

    oldTeacher.Address = address;
    await oldTeacher.save();

    return res.status(200).json(oldTeacher);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error while updating teacher" });
  }
};

module.exports.editPassword = async (req, res) => {
  try {
    const id = req.params.TeacherId;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(404).json({ error: "Provide all infromation" });
    }
    

    const oldPassword = await Teacher.findOne({ _id: id });

    if (!oldPassword) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    
    const isMatch = await bcrypt.compare(currentPassword, oldPassword.password);

    if (!isMatch) {
      return res.status(404).json({
        error: "Wrong current password. Please enter correct password",
      });
    }
    const hashedpassword = await bcrypt.hash(confirmPassword, 10);

    oldPassword.password = hashedpassword;
    await oldPassword.save();

    await sendEmail({
      email: oldPassword.email,
      subject: "Your Password Has Been Changed 🔐",
      message: `Hello ${oldPassword.firstName}, your password was successfully updated. If you did not request this change, please contact support immediately.`,
      html: passwordChanged(oldPassword),
    });

    return res.status(200).json(oldPassword);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error while updating teacher" });
  }
};

module.exports.updateProfilePic = async (req, res) => {
  try {
    const { ProfilePic } = req.body;
    const id = req.params.TeacherId;

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
          const uploadResponse = await cloudinary.uploader.upload(ProfilePic, {
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

        // // Add a unique identifier to prevent caching issues
        // const timestampedUrl = imageUrl.includes("?")
        //   ? `${imageUrl}&t=${Date.now()}`
        //   : `${imageUrl}?t=${Date.now()}`;

        const updatedUser = await Teacher.findOneAndUpdate(
          { _id: id },
          { ProfilePic: imageUrl }, // Store the URL in DB
          { new: true }
        ) // Exclude password from response
        if (!updatedUser) {
          return res.status(404).json({ message: "User not found" });
        }

        console.log("User profile updated successfully");

        return res.status(200).json({
          message: "Profile updated successfully",
          updatedUser: {
            ...updatedUser.toObject(),
            ProfilePic: imageUrl, // Send back timestamped URL to client
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