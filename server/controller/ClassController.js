const Class = require("../model/Classmodel");

module.exports.getallClass = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate("teacherId")
      .populate("subject")
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};