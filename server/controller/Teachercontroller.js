const Teacher = require("../model/Teachermodel");
const Cloudinary = require("../lib/Cloudinary");
const generator = require("generate-password");
const User = require("../model/Usermodel");
const Class = require("../model/Classmodel")
const Subject = require("../model/Subjectmodel")

module.exports.createTeacherprofile = async (req, res) => {
  console.log(req.body)
  try {
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
      qualification,
      experience,
      attendance,
      assignedClasses,
      Classes,
    } = req.body;

    if (!Firstname || !Lastname) {
      return res
        .status(404)
        .json({ error: "Please provide all necessary information" });
    }
    const isTeacher = await Teacher.findOne({email: email})
    if(isTeacher) {
      return res.status(404).json({ error: "Teacher already registered!" });
    }
    const isSubject = await await Subject.findOne({
      SubjectName: subjects
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
    const newTeacher = await Teacher.create({
      firstName: Firstname,
      lastName: Lastname,
      email: email,
      password: password,
      phone: Phone,
      Address: address,
      Dateofbirth: dateOfBirth,
      gender: gender,
      profileImage: profileImage,
      attendance: attendance,
      assignedClasses: assignedClasses,
      qualification: qualification,
      experience: experience
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
      experience
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
    if(!classDoc) {
      return res.status(404).json({ error: "Class not found" });
    }

    if(!subjectDoc) {
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
