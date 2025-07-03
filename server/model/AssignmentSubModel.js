const mongoose = require("mongoose");
const { Schema } = mongoose;

const AssignmentSubSchema = new Schema(
  {
    assignment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    answerUrl: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
    },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AssignmentSub = mongoose.model("AssignmentSub", AssignmentSubSchema);

module.exports = AssignmentSub;