const Student = require("../model/Studentmodel");
const Grade = require("../model/Grade");
const Class = require("../model/Classmodel");
const generator = require("generate-password");
const cloudinary = require("../lib/Cloudinary");

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

    const password = generator.generate({
      length: 8,
      numbers: true,
      symbols: false,
      uppercase: true,
      lowercase: true,
      strict: true, // ensures at least one character from each pool
    });

    console.log(password);

    const newStudent = new Student({
      firstName,
      lastName,
      email,
      phone,
      address,
      Dateofbirth,
      gender,
      password,
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
