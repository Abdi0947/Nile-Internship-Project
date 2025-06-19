const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
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
    address: {
      type: String,
    },
    role: {
      type: String,
      default: "Student",
    },
    Dateofbirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    parentName: {
      type: String,
    },
    parentPhone: {
      type: String,
    },

    ProfilePic: {
      type: String,
    },

    attendance: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TeacherAttendance",
      },
    ],

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    feeStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },

    status: {
      type: String,
      enum: ["active", "graduated", "suspended"],
      default: "active",
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;
