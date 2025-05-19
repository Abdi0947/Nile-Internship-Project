import React, { useState } from 'react';
import TopNavbar from '../components/Topnavbar';
import { motion } from 'framer-motion';
import { FiCalendar, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';

function StudentAttendance() {
  // Mock data - would be replaced with actual API data
  const [attendanceData] = useState({
    overallAttendance: 92,
    totalClasses: 120,
    presentClasses: 110,
    absentClasses: 10,
    monthlyAttendance: [
      {
        month: 'January',
        present: 22,
        absent: 2,
        percentage: 91.7
      },
      {
        month: 'February',
        present: 20,
        absent: 1,
        percentage: 95.2
      },
      {
        month: 'March',
        present: 21,
        absent: 2,
        percentage: 91.3
      },
      {
        month: 'April',
        present: 19,
        absent: 3,
        percentage: 86.4
      },
      {
        month: 'May',
        present: 20,
        absent: 1,
        percentage: 95.2
      },
      {
        month: 'June',
        present: 8,
        absent: 1,
        percentage: 88.9
      }
    ],
    recentAttendance: [
      {
        date: '2024-03-15',
        subject: 'Mathematics',
        status: 'present',
        time: '09:00 AM'
      },
      {
        date: '2024-03-14',
        subject: 'Science',
        status: 'present',
        time: '10:30 AM'
      },
      {
        date: '2024-03-13',
        subject: 'English',
        status: 'absent',
        time: '11:45 AM'
      },
      {
        date: '2024-03-12',
        subject: 'History',
        status: 'present',
        time: '01:15 PM'
      },
      {
        date: '2024-03-11',
        subject: 'Physics',
        status: 'present',
        time: '02:30 PM'
      }
    ]
  });

  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />
      
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Attendance Overview</h1>
            <p className="text-gray-600 mt-1">Track your class attendance and performance</p>
          </div>

          {/* Overall Attendance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overall Attendance</p>
                  <p className="text-3xl font-bold text-gray-800">{attendanceData.overallAttendance}%</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FiCalendar className="text-blue-600 text-xl" />
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${attendanceData.overallAttendance}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Classes</p>
                  <p className="text-3xl font-bold text-gray-800">{attendanceData.totalClasses}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <FiCheckCircle className="text-green-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Present</p>
                  <p className="text-3xl font-bold text-gray-800">{attendanceData.presentClasses}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <FiCheckCircle className="text-green-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Absent</p>
                  <p className="text-3xl font-bold text-gray-800">{attendanceData.absentClasses}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <FiXCircle className="text-red-600 text-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Attendance Chart */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Attendance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {attendanceData.monthlyAttendance.map((month, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-800">{month.month}</h3>
                    <span className="text-sm font-medium text-gray-600">{month.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div 
                      className={`h-full rounded-full ${
                        month.percentage >= 90 ? 'bg-green-500' :
                        month.percentage >= 75 ? 'bg-blue-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${month.percentage}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 flex justify-between text-sm text-gray-600">
                    <span>Present: {month.present}</span>
                    <span>Absent: {month.absent}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Attendance */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Recent Attendance</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {attendanceData.recentAttendance.map((record, index) => (
                <div key={index} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${
                        record.status === 'present' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {record.status === 'present' ? 
                          <FiCheckCircle className="text-green-600" /> : 
                          <FiXCircle className="text-red-600" />
                        }
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{record.subject}</h3>
                        <p className="text-sm text-gray-600">{formatDate(record.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FiClock className="mr-1" />
                      {record.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default StudentAttendance; 