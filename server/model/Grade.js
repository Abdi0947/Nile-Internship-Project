const mongoose = require('mongoose');
const { Schema } = mongoose;

const GradeSchema = new Schema({
  
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  examType: {
    type: String,
    enum: ['Midterm', 'Final', 'Assignment'], 
    required: true
  }
}, {
  timestamps: true
});

const Grade = mongoose.model('Grade', GradeSchema);

module.exports = Grade;
