const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    Address: {
      type: String,
    },
    Dateofbirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },

    profileImage: {
      type: String,
    },
    qualification: {
      type: String,
    },

    experience: {
      type: Number,
    },
    role: {
      type: String,
      default: "teacher",
    },

    subjects: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    attendance: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TeacherAttendance",
      },
    ],
  },
  { timestamps: true }
);

const Teacher = mongoose.model("Teacher", TeacherSchema);

module.exports = Teacher;
