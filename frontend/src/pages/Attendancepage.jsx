import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAttendance, addAttendance, removeAttendance, updateAttendance } from '../features/Attendance';
import { fetchAllStudents } from '../features/Student';
import { getTeacherById } from "../features/Teacher";
import TopNavbar from "../components/Topnavbar";
import { format } from 'date-fns';
import toast from 'react-hot-toast';

function Attendancepage() {
  const dispatch = useDispatch();
  const { allAttendance, isAttendanceLoading } = useSelector(state => state.attendance);
  const { Authuser } = useSelector((state) => state.auth);
  const { students } = useSelector(state => state.Student);
  const { teacherDetails } = useSelector((state) => state.Teacher);
  const teacheId = Authuser?.id || Authuser?._id;
  const yourStudent = students?.filter(
    (item) => item?.classId?._id === Authuser?.classId
  );
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAttendanceId, setEditingAttendanceId] = useState(null);
  const [viewMode, setViewMode] = useState('record'); // 'record' or 'view'
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [filterParams, setFilterParams] = useState({
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    class: '',
    subject: '',
    status: ''
  });

  // Class and subject options (replace with actual data from your API)
  const classOptions = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6'];
  const subjectOptions = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Computer Science'];

  useEffect(() => {
    dispatch(getAllAttendance());
    dispatch(fetchAllStudents());
  }, [dispatch]);


  useEffect(() => {
    if (yourStudent && yourStudent?.length > 0 && selectedClass) {
      // In a real app, filter students by class
      const filteredStudents = yourStudent?.filter(
        (student) => student?.status === "active" // Only include active students
      );

      setAttendanceData(
        filteredStudents.map((student) => ({
          studentId: student._id,
          studentName: `${student.firstName} ${student.lastName}`,
          status: "present",
          remarks: "",
          teacherId: teacheId,
          subjectId: teacherDetails?.subjects?._id,
          classId: selectedClass,
          date: selectedDate,
        }))
      );
    }
  }, [students, selectedClass]);

  useEffect(() => {
    if (allAttendance && viewMode === 'view') {
      filterAttendanceRecords();
    }
  }, [allAttendance, filterParams, viewMode]);

  useEffect(() => {
      if (teacheId) {
        dispatch(getTeacherById(teacheId));
      }
    }, [dispatch, teacheId]);
    
    // const classOptions = teacherDetails?.classId;
    // const subjectOptions = teacherDetails?.subjects;

  const filterAttendanceRecords = () => {
    if (!allAttendance) return;
    
    const filtered = allAttendance.filter(record => {
      const recordDate = new Date(record.date);
      const startDate = new Date(filterParams.startDate);
      const endDate = new Date(filterParams.endDate);
      
      // Reset hours to compare dates only
      recordDate.setHours(0, 0, 0, 0);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      
      const dateMatches = recordDate >= startDate && recordDate <= endDate;
      const classMatches = filterParams.class ? record.class === filterParams.class : true;
      const subjectMatches = filterParams.subject ? record.subject === filterParams.subject : true;
      
      return dateMatches && classMatches && subjectMatches;
    });
    
    setFilteredAttendance(filtered);
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev => 
      prev.map(item => 
        item.studentId === studentId ? { ...item, status } : item
      )
    );
  };

  const handleNoteChange = (studentId, remarks) => {
    setAttendanceData(prev => 
      prev.map(item => 
        item.studentId === studentId ? { ...item, remarks } : item
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedClass || !selectedSubject) {
      toast.error('Please select date, class and subject');
      return;
    }

    if (attendanceData.length === 0) {
      toast.error('No students available for attendance');
      return;
    }

    const attendancePayload = {
      attendanceRecords: attendanceData
    };

    if (isEditing && editingAttendanceId) {
      dispatch(updateAttendance({ 
        id: editingAttendanceId, 
        updatedData: attendancePayload 
      }));
      setIsEditing(false);
      setEditingAttendanceId(null);
    } else {
      dispatch(addAttendance(attendancePayload));
    }

    // Reset form
    // setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
    // setSelectedClass('');
    // setSelectedSubject('');
    // setAttendanceData([]);
    toast.success("Assignment created successfully!");
  };
  console.log(attendanceData);
  const handleEdit = (attendance) => {
    setIsEditing(true);
    setEditingAttendanceId(attendance._id);
    setSelectedDate(format(new Date(attendance.date), 'yyyy-MM-dd'));
    setSelectedClass(attendance.class);
    setSelectedSubject(attendance.subject);
    setAttendanceData(attendance.attendanceRecords);
    setViewMode('record');
  };

  const handleDelete = (attendanceId) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      dispatch(removeAttendance(attendanceId));
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterParams(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Attendance Management
            </h1>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode("record")}
                className={`px-4 py-2 rounded ${
                  viewMode === "record"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Record Attendance
              </button>
              <button
                onClick={() => setViewMode("view")}
                className={`px-4 py-2 rounded ${
                  viewMode === "view"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                View Records
              </button>
            </div>
          </div>

          {viewMode === "record" ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Class</option>
                    <option
                      key={teacherDetails?.classId._id}
                      value={teacherDetails?.classId?._id}
                    >
                      {teacherDetails?.classId.ClassName}
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Subject</option>
                    <option
                      key={teacherDetails?.subjects?._id}
                      value={teacherDetails?.subjects?._id}
                    >
                      {teacherDetails?.subjects?.SubjectName}
                    </option>
                  </select>
                </div>
              </div>

              {selectedClass && selectedSubject ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="py-2 px-4 border text-left">
                            Student
                          </th>
                          <th className="py-2 px-4 border text-left">Status</th>
                          <th className="py-2 px-4 border text-left">Note</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceData.length > 0 ? (
                          attendanceData.map((item, index) => (
                            <tr
                              key={item.studentId}
                              className={
                                index % 2 === 0 ? "bg-gray-50" : "bg-white"
                              }
                            >
                              <td className="py-2 px-4 border">
                                {item.studentName}
                              </td>
                              <td className="py-2 px-4 border">
                                <select
                                  value={item.status}
                                  onChange={(e) =>
                                    handleStatusChange(
                                      item.studentId,
                                      e.target.value
                                    )
                                  }
                                  className="w-full p-1 border rounded"
                                >
                                  <option value="present">Present</option>
                                  <option value="absent">Absent</option>
                                  <option value="late">Late</option>
                                  <option value="excused">Excused</option>
                                </select>
                              </td>
                              <td className="py-2 px-4 border">
                                <input
                                  type="text"
                                  value={item.remarks}
                                  onChange={(e) =>
                                    handleNoteChange(
                                      item.studentId,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Add remarks"
                                  className="w-full p-1 border rounded"
                                />
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="3"
                              className="py-4 text-center text-gray-500"
                            >
                              No students available for this class
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleSubmit}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      disabled={isAttendanceLoading}
                    >
                      {isAttendanceLoading
                        ? "Saving..."
                        : isEditing
                        ? "Update Attendance"
                        : "Save Attendance"}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Please select a class and subject to record attendance
                </div>
              )}
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={filterParams.startDate}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={filterParams.endDate}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class
                  </label>
                  <select
                    name="class"
                    value={filterParams.class}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">All Classes</option>
                    {classOptions.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={filterParams.subject}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">All Subjects</option>
                    {subjectOptions.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={filterAttendanceRecords}
                    className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-4 border text-left">Date</th>
                      <th className="py-2 px-4 border text-left">Class</th>
                      <th className="py-2 px-4 border text-left">Subject</th>
                      <th className="py-2 px-4 border text-left">Present</th>
                      <th className="py-2 px-4 border text-left">Absent</th>
                      <th className="py-2 px-4 border text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isAttendanceLoading ? (
                      <tr>
                        <td colSpan="6" className="py-4 text-center">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                          </div>
                        </td>
                      </tr>
                    ) : filteredAttendance && filteredAttendance.length > 0 ? (
                      filteredAttendance.map((attendance) => {
                        // Calculate attendance statistics
                        const totalStudents =
                          attendance.attendanceRecords?.length || 0;
                        const presentCount =
                          attendance.attendanceRecords?.filter(
                            (r) => r.status === "present"
                          ).length || 0;
                        const absentCount =
                          attendance.attendanceRecords?.filter(
                            (r) => r.status === "absent"
                          ).length || 0;

                        return (
                          <tr key={attendance._id}>
                            <td className="py-2 px-4 border">
                              {format(new Date(attendance.date), "dd/MM/yyyy")}
                            </td>
                            <td className="py-2 px-4 border">
                              {attendance.class}
                            </td>
                            <td className="py-2 px-4 border">
                              {attendance.subject}
                            </td>
                            <td className="py-2 px-4 border">{presentCount}</td>
                            <td className="py-2 px-4 border">{absentCount}</td>
                            <td className="py-2 px-4 border">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEdit(attendance)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(attendance._id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="py-4 text-center text-gray-500"
                        >
                          No attendance records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Attendancepage;