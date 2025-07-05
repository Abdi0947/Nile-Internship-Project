const Assignment = require("../model/Assignmentmodel");
const AssignmentSub = require("../model/AssignmentSubModel");

exports.createAssgiment = async (req, res) => {
  try {
    const {
      title,
      description,
      ClassId,
      teacherId,
      maxScore,
      dueDate,
      subject,
    } = req.body;

    let attachmentUrl = req.file?.path;

    if (!attachmentUrl) {
      return res.status(400).json({ error: "Attachment is required." });
    }
    attachmentUrl = attachmentUrl.replace("/image/upload/", "/raw/upload/");

    const assignment = new Assignment({
      title,
      description,
      subject,
      ClassId,
      teacherId,
      maxScore,
      dueDate,
      attachments: attachmentUrl,
    });

    await assignment.save();

    res.status(201).json({
      message: "Assignment created successfully",
      assignment,
    });
  } catch (error) {
    console.error("Error during creating Assignment:", error.message);
    res
      .status(400)
      .json({ error: "Error during Assignment: " + error.message });
  }
};

exports.getAssignmentsByTeacherId = async (req, res) => {
  try {
    const { teacherId } = req.params;

    if (!teacherId) {
      return res.status(400).json({ error: "Teacher ID is required." });
    }

    const assignments = await Assignment.find({ teacherId })
      .populate("ClassId")
      .populate("subject");


    res.status(200).json({
      message: "Assignments retrieved successfully",
      assignments,
    });
  } catch (error) {
    console.error("Error retrieving assignments:", error.message);
    res
      .status(500)
      .json({ error: "Error retrieving assignments: " + error.message });
  }
};

exports.getAssignmentById = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    if (!assignmentId) {
      return res.status(400).json({ error: "Assignment ID is required." });
    }

    const assignment = await Assignment.findById(assignmentId)
      .populate("ClassId")
      .populate("subject");

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found." });
    }
    
    res.status(200).json({
      message: "Assignment retrieved successfully",
      assignment,
    });
  } catch (error) {
    console.error("Error retrieving assignment by ID:", error.message);
    res
      .status(500)
      .json({ error: "Error retrieving assignment: " + error.message });
  }
};
exports.getAllAssignments = async (req, res) => {
  try {
    const assignment = await Assignment.find()
      .populate("ClassId")
      .populate("subject");

    res.status(200).json({
      assignment,
    });
  } catch (error) {
    console.error("Error retrieving assignment by ID:", error.message);
    res
      .status(500)
      .json({ error: "Error retrieving assignment: " + error.message });
  }
};
exports.submitAssignment = async (req, res) => {
  try {
    const { student_id, AssignmentId, comment } = req.body;
    let attachmentUrl = req.file?.path;

    if (!attachmentUrl) {
      return res.status(400).json({ error: "Attachment is required." });
    }
    attachmentUrl = attachmentUrl.replace("/image/upload/", "/raw/upload/");

    const assignmentSubmitted = new AssignmentSub({
      student_id,
      assignment_id: AssignmentId,
      comment,
      answerUrl: attachmentUrl,
    });

    await assignmentSubmitted.save();

    res.status(201).json({
      message: "Assignment submitted successfully",
      assignmentSubmitted,
    });
  } catch (error) {
    console.error("Error during creating Assignment:", error.message);
    res
      .status(400)
      .json({ error: "Error during Assignment: " + error.message });
  }
};
module.exports.deleteAssignment = async (req, res) => {
  const { teacherId } = req.params;

  console.log(req.body);

  try {
    const deletedGrade = await Assignment.findByIdAndDelete({ _id: teacherId });

    if (!deletedGrade)
      return res.status(404).json({ message: "Assignment not found" });

    res.status(200).json({ message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getSubmitAssignmentById = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment_id = assignmentId;
    console.log("Assignment ID:", assignment_id);

    if (!assignmentId) {
      return res.status(400).json({ error: "Assignment ID is required." });
    }

    const assignment = await AssignmentSub.find({assignment_id}).populate(
      "student_id"
    );

    
    const transformed = assignment.map((item) => ({
      StudentName: `${item.student_id.firstName} ${item.student_id.lastName}`,
      status: "submitted",
      comment: item.comment,
      answerUrl: item.answerUrl,
      date: item.createdAt,
    }));
    res.status(200).json(transformed);
  } catch (error) {
    console.error("Error retrieving assignment by ID:", error.message);
    res
      .status(500)
      .json({ error: "Error retrieving assignment: " + error.message });
  }
};