const Class = require("../model/Classmodel");

module.exports.getallClass = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate("teacherId")
      .populate("subject");
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports.getClassById = async (req, res) => {
  const { classId } = req.params;
  try {
    const classes = await Class.find({ _id: classId })
      .populate("teacherId")
      .populate("subject");

    const result = classes[0].subject
      .map((subj) => {
        const teacher = classes[0].teacherId.find(
          (teacher) => teacher.subjects.toString() === subj._id.toString()
        );
        if (!teacher) return null;
        return {
          subjectName: subj.SubjectName,
          teacherName: `${teacher.firstName.trim()} ${teacher.lastName.trim()}`,
        };
      })
      .filter(Boolean);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
