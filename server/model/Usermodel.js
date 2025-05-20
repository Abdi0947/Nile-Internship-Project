const mongoose = require("mongoose");
const crypto = require("crypto");
const UserSchema = new mongoose.Schema(
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
   
    role: {
      type: String,
      enum: ["Teacher", "Manager", "Admin", "Student", "teacher", "manager", "admin", "student", "administrative"],
      default: "Student",
    },
    ProfilePic: {
      type: String,
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: function() {
        return this.role.toLowerCase() === "teacher" ? "pending" : "approved";
      }
    },
    approvalDate: {
      type: Date
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    rejectionReason: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
