const Teacher = require("../model/Teachermodel");
const Cloudinary = require("../lib/Cloudinary");
const User = require("../model/Usermodel");

module.exports.createTeacherprofile = async (req, res) => {
  console.log(req.body)
  console.log(req.user?._id);
  try {
    const userId = req.user?._id;
    const {
      Firstname,
      Lastname,
      email,
      Phone,
      address,
      dateOfBirth,
      gender,
      profileImage,
      subjects,
      attendance,
      assignedClasses,
   
    } = req.body;

    if (
      !Firstname ||
      !Lastname ||
      !email ||
      !Phone ||
      !address ||
      !dateOfBirth ||
      !gender 

   
    
    ) {
      return res
        .status(400)
        .json({ error: "Please provide all necessary information" });
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

    const newTeacher = new Teacher({
      firstName: Firstname,
      lastName: Lastname,
      email: email,
      phone: Phone,
      Address: address,
      Dateofbirth: dateOfBirth,
      gender: gender,
      profileImage: profileImage,
      subjects: subjects,
      attendance: attendance,
      assignedClasses: assignedClasses,
    });

    await newTeacher.save();

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
      .populate("attendance")
      .populate("assignedClasses");

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
    const updateData = req.body;

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      TeacherId,
      updateData,
      { new: true }
    );

    if (!updatedTeacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.status(200).json(updatedTeacher);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.deleteTeacher = async (req, res) => {
  try {
    const { TeacherId } = req.params;
    const deletedTeacher = await Teacher.findByIdAndDelete(TeacherId);
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
