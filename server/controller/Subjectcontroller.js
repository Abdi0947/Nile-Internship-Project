const Subject = require('../model/Subjectmodel');



module.exports.createSubject = async (req, res) => {
  try {
    const { SubjectName} = req.body;


    const subject = new Subject({
      SubjectName
  
    });

 
    await subject.save();

    res.status(201).json({
      message: 'Subject created successfully!',
      subject
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Get all subjects
module.exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate("ClassId")

    res.status(200).json(subjects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Get subject by ID
module.exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate('ClassId')

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.status(200).json(subject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Update a subject
module.exports.updateSubject = async (req, res) => {
  try {
    const { SubjectName, TeacherId, ClassId } = req.body;
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { SubjectName, TeacherId, ClassId },
      { new: true }
    );

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.status(200).json({
      message: 'Subject updated successfully!',
      subject
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Delete a subject
module.exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.status(200).json({
      message: 'Subject deleted successfully!',
      subject
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
