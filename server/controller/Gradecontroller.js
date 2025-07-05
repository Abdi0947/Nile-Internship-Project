const Grade = require("../model/Grade");

module.exports.createGrade = async (req, res) => {
  try {
    const { studentId, subjectId, teacherId, grade, examType } = req.body;

    if (!studentId || !subjectId || !teacherId || !grade || !examType) {
      return res
        .status(400)
        .json({ error: "Please provide all neccessary information" });
    }
    const existingGrade = await Grade.findOne({
      studentId: studentId,
      subjectId: subjectId,
      examType: examType,
    });
    if (existingGrade) {
      return res
        .status(400)
        .json({ error: "Grade for this exam type already exists" });
    }
    const newGrade = new Grade({
      studentId,
      subjectId,
      teacherId,
      grade,
      examType,
    });

    await newGrade.save();

    res.status(201).json({
      message: "Grade created successfully",
    });
  } catch (error) {
    console.error("Error during creating Grade:", error.message);
    res.status(400).json({ error: "Error during Grade: " + error.message });
  }
};

module.exports.getallGrade = async (req, res) => {
  const { teacherId } = req.params;
  try {
    const grades = await Grade.find({
      teacherId: teacherId,
    })
      .populate("studentId")
      .populate("subjectId");

    const transformed = [];

    grades.forEach((entry) => {
      const firstName = entry.studentId.firstName;
      const lastName = entry.studentId.lastName;
      const studentId = entry.studentId._id;
      const fullName = `${firstName} ${lastName}`;
      const examType = entry.examType.toLowerCase();
      const grade = Number(entry.grade);

      let student = transformed.find((s) => s.studentName === fullName);

      if (!student) {
        student = {
          id: studentId,
          studentName: fullName,
          assignment: null,
          midTerm: null,
          final: null,
        };
        transformed.push(student);
      }

      if (examType === "assignment") student.assignment = grade;
      else if (examType === "midterm") student.midTerm = grade;
      else if (examType === "final") student.final = grade;
    });
    res.status(200).json(transformed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.getGradeById = async (req, res) => {
  try {
    const { studentId } = req.params;
    const grade = await Grade.find({ studentId: studentId })
      .populate("studentId")
      .populate("subjectId")
      .populate("teacherId");
    
    const result = [];

    if (!grade) return res.status(404).json({ message: "Grade not found" });
    grade.forEach(entry => {
      const subjectName = entry.subjectId.SubjectName;
      const teacherName = `${entry.teacherId.firstName.trim()} ${entry.teacherId.lastName.trim()}`;
      const examType = entry.examType.toLowerCase(); // assignment, midterm, final
      const grade = parseFloat(entry.grade);
    
      // Check if an entry for this subject and teacher already exists
      let subject = result.find(
        s => s.subjectName === subjectName && s.teacherName === teacherName
      );
    
      // If not found, create a new one
      if (!subject) {
        subject = {
          subjectName,
          teacherName,
          assignment: null,
          midterm: null,
          final: null
        };
        result.push(subject);
      }
    
      // Assign grade to corresponding exam type
      if (examType === "assignment") subject.assignment = grade;
      else if (examType === "midterm") subject.midterm = grade;
      else if (examType === "final") subject.final = grade;
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.updateGrade = async (req, res) => {
  const { studentId, subjectId, teacherId, grade, examType } = req.body;
  try {
    if (!studentId || !examType || !grade) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }
    const findGradeOfStudent = await Grade.find({ studentId: studentId });
    if (findGradeOfStudent.length === 0) {
      return res
        .status(404)
        .json({ message: "Grade not found for this student" });
    }
    const findGrade = await Grade.find({
      studentId: studentId,
      examType: examType,
    });
    if (findGrade.length === 0) {
      const newGrade = new Grade({
        studentId,
        subjectId,
        teacherId,
        grade,
        examType,
      });
      newGrade.save();
      return res.status(201).json({ message: "Grade updated successfully" });
    }

    const updatedGrade = await Grade.findOneAndUpdate(
      { studentId: studentId, examType: examType },
      { grade },
      { new: true }
    );
    updatedGrade.save();
    res.status(200).json({ message: "Grade updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.deleteGrade = async (req, res) => {
  const { studentId } = req.params;
  const { teacherId } = req.body;

  console.log(req.body);

  try {
    const deletedGrade = await Grade.deleteMany({
      studentId: studentId,
      teacherId: teacherId,
    });
 
    if (!deletedGrade)
      return res.status(404).json({ message: "Grade not found" });

    res.status(200).json({ message: "Grade deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


