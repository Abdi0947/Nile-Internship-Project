const Student = require("../model/Studentmodel");
const Teacher = require("../model/Teachermodel");
const User = require("../model/Usermodel");
const Grade = require("../model/Grade");
const Class = require("../model/Classmodel");
const bcrypt = require("bcryptjs");
const generator = require("generate-password");
const cloudinary = require("../lib/Cloudinary");
const crypto = require("crypto");
const sendEmail = require("../lib/email");

// Add this email template function at the top of the file
const getWelcomeEmailTemplate = (newStudent, password) => `
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
            <h2>Hello ${newStudent.firstName} ${newStudent.lastName},</h2>
            <p>Welcome to our platform! We're excited to have you join our community.</p>
            <p>Your account has been successfully created with the following details:</p>
            <ul>
                <li>Email: ${newStudent.email}</li>
                <li>Password: ${password}</li>
                <li>Role: ${newStudent.role}</li>
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

module.exports.UpdateProfile = async (req, res) => {
  const ProfilePic = req.file;
  try {
    const userId = req.user?._id;
    const {
      firstName,
      lastName,
      email,
      phone,
      grade,
      address,
      Dateofbirth,
      gender,
      parentPhone,
      parentName,
    } = req.body;
    console.log(grade);
    if (!firstName || !lastName) {
      return res
        .status(400)
        .json({ error: "Please provide all neccessary information" });
    }
    const user = await User.findOne({ email });
    const student = await Student.findOne({ email });
    const teacher = await Teacher.findOne({ email });

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

    const password = generator.generate({
      length: 8,
      numbers: true,
      symbols: false,
      uppercase: true,
      lowercase: true,
      strict: true, // ensures at least one character from each pool
    });
    const hashedpassword = await bcrypt.hash(password, 10);

    console.log(password);

    const newStudent = new Student({
      firstName,
      lastName,
      email,
      phone,
      address,
      Dateofbirth,
      gender,
      password: hashedpassword,
      classId: grade,
      parentPhone,
      parentName,
    });

    await newStudent.save();

    if (ProfilePic) {
      if (req.file) {
        await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "profile_school_management_system",
              upload_preset: "upload",
            },
            async (error, result) => {
              if (error) {
                console.error("Cloudinary upload failed:", error);
                return reject(error);
              }

              newStudent.profileImage = result.secure_url;
              await newStudent.save();
              resolve();
            }
          );
          stream.end(req.file.buffer);
        });
      }
    }
    await sendEmail({
      email: newStudent.email,
      subject: "Welcome to Portal System! 🎓",
      message: `Welcome ${newStudent.firstName}! Your account has been successfully created.`,
      html: getWelcomeEmailTemplate(newStudent, password),
    });
    res.status(201).json({
      message: "Student profile created successfully",
    });
  } catch (error) {
    console.error("Error during creating Student profile:", error.message);
    res.status(400).json({
      error: "Error during creating Student profile: " + error.message,
    });
  }
};
module.exports.EditProfile = async (req, res) => {
  try {
    const { StudentId } = req.params;
    const {
      firstName,
      lastName,
      email,
      phone,
      gender,
      Dateofbirth,
      address,
      classId,
      parentName,
      parentPhone,
    } = req.body;
    console.log(req.body);
    let isClass;
    if (typeof classId === "object") {
      isClass = classId._id;
    } else {
      isClass = classId;
    }

    const checkClass = await Class.findById(isClass);
    if (!checkClass) {
      return res.status(404).json({ error: "Class not found." });
    }

    const updatedData = {
      firstName,
      lastName,
      email,
      phone,
      gender,
      Dateofbirth,
      address,
      classId: isClass,
      parentName,
      parentPhone,
    };

    const updatedStudent = await Student.findByIdAndUpdate(
      StudentId,
      updatedData,
      {
        new: true,
      }
    );
    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error("Error during creating Student profile:", error.message);
    res.status(400).json({
      error: "Error during creating Student profile: " + error.message,
    });
  }
};

exports.DeleteProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const deleteStudent = await Student.findByIdAndDelete(userId);
    if (!deleteStudent) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User profile deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

module.exports.getallStudents = async (req, res) => {
  try {
    const allStudents = await Student.find().populate("classId");
    res.json({ students: allStudents });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.GetAcadamicRecords = async (req, res) => {
  try {
    const { userId } = req.params;
    const Studentinfo = await Student.findById(userId);
    if (!Studentinfo) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const grades = await Grade.find({ userId });
    if (grades.length === 0) {
      return res.status(404).json({
        message: "No academic records found",
      });
    }

    res.status(200).json({
      academicRecords: grades,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error,
    });
  }
};
