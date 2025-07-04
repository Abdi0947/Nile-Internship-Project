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
  const { teacherId } = req.params;
  try {
    const attendanceList = await Attendance.find({ teacherId })
      .populate("studentId")
      .populate("teacherId")
      .populate("classId");

    
    const groupedMap = new Map();

    attendanceList.forEach((item) => {
      const key = `${item.date}_${item.subjectId}_${item.classId._id}`;

      if (!groupedMap.has(key)) {
        groupedMap.set(key, {
          date: item.date,
          subjectId: item.subjectId,
          className: item.classId.ClassName,
          classId: item.classId._id,
          attendanceRecords: [],
        });
      }

      groupedMap.get(key).attendanceRecords.push({
        studentId: item.studentId._id,
        studentName: item.studentId.name,
        status: item.status,
        note: item.note || "",
      });
    });

   
    const groupedArray = Array.from(groupedMap.values());
    res.status(200).json(groupedArray);
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
