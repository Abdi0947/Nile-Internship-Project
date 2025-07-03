const Attendance = require('../model/Attendance');


module.exports.createAttendance = async (req, res) => {
  try {
    const { attendanceRecords}=req.body;


    if ( !attendanceRecords) {
        return res
          .status(400)
          .json({ error: "Please provide all neccessary information" });
      }



      await Attendance.insertMany(attendanceRecords);
    res.status(201).json("Attendance recorded successfully");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports.getAllAttendance = async (req, res) => {
  try {
    const attendanceList = await Attendance.find()
      .populate('studentId')
      .populate('teacherId')
      .populate('classId');
    res.status(200).json(attendanceList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports.getAttendanceById = async (req, res) => {

  try {
    const {AttendanceId}=req.params;
    const attendance = await Attendance.findById(AttendanceId)
      .populate('studentId')
      .populate('teacherId')
      .populate('classId');

    if (!attendance) return res.status(404).json({ message: 'Attendance not found' });

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports.updateAttendance = async (req, res) => {
  try {
    const {AttendanceId}=req.params;
    const {updateddata}=req.body;
    const updated = await Attendance.findByIdAndUpdate(AttendanceId, updateddata, {
      new: true
    });

    if (!updated) return res.status(404).json({ message: 'Attendance not found' });

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports.deleteAttendance = async (req, res) => {
  try {
    const {AttendanceId}=req.params;
    const deleted = await Attendance.findByIdAndDelete(AttendanceId);

    if (!deleted) return res.status(404).json({ message: 'Attendance not found' });

    res.status(200).json({ message: 'Attendance deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
