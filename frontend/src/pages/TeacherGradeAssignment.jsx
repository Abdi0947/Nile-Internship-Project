import React, { useState } from 'react';
import TopNavbar from '../components/Topnavbar';
import { motion } from 'framer-motion';
import { FiUpload, FiFile, FiX, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

function TeacherGradeAssignment() {
  const [selectedClass, setSelectedClass] = useState('');
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDescription, setAssignmentDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTab, setSelectedTab] = useState('create'); // 'create' or 'grade'

  // Mock data - would be replaced with actual API data
  const classes = [
    { id: 1, name: 'Mathematics 101', students: 25 },
    { id: 2, name: 'Physics 201', students: 20 },
    { id: 3, name: 'Chemistry 101', students: 22 },
  ];

  const pendingAssignments = [
    {
      id: 1,
      title: 'Algebra Homework Set 4',
      class: 'Mathematics 101',
      submittedBy: 18,
      totalStudents: 25,
      dueDate: '2024-03-20'
    },
    {
      id: 2,
      title: 'Chemical Reactions Lab Report',
      class: 'Chemistry 101',
      submittedBy: 15,
      totalStudents: 22,
      dueDate: '2024-03-22'
    }
  ];

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Here you would typically upload files and submit the assignment
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form
      setAssignmentTitle('');
      setAssignmentDescription('');
      setDueDate('');
      setFiles([]);
      setSelectedClass('');
      
      // Show success message
      alert('Assignment created successfully!');
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Error creating assignment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
            <h1 className="text-2xl font-bold text-gray-800">Assignment Management</h1>
            <p className="text-gray-600 mt-1">Create new assignments and grade submitted work</p>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setSelectedTab('create')}
                  className={`${
                    selectedTab === 'create'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Create Assignment
                </button>
                <button
                  onClick={() => setSelectedTab('grade')}
                  className={`${
                    selectedTab === 'grade'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Grade Assignments
                </button>
              </nav>
            </div>
          </div>

          {selectedTab === 'create' ? (
            /* Create Assignment Form */
            <div className="bg-white rounded-xl shadow-md p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Class Selection */}
                <div>
                  <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Class
                  </label>
                  <select
                    id="class"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    required
                  >
                    <option value="">Select a class</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} ({cls.students} students)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assignment Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Assignment Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={assignmentTitle}
                    onChange={(e) => setAssignmentTitle(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                {/* Assignment Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    value={assignmentDescription}
                    onChange={(e) => setAssignmentDescription(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                {/* Due Date */}
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="datetime-local"
                    id="dueDate"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attachments
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                        >
                          <span>Upload files</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            multiple
                            className="sr-only"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, DOC, DOCX, or ZIP up to 10MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-700">Selected Files:</h3>
                    <ul className="divide-y divide-gray-200">
                      {files.map((file, index) => (
                        <li key={index} className="py-2 flex items-center justify-between">
                          <div className="flex items-center">
                            <FiFile className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-600">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FiX className="h-5 w-5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
                      ${isSubmitting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                      }`}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Assignment'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Grade Assignments List */
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Pending Assignments</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {pendingAssignments.map((assignment) => (
                  <div key={assignment.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">{assignment.title}</h3>
                        <p className="text-sm text-gray-600">{assignment.class}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            Submitted: {assignment.submittedBy}/{assignment.totalStudents}
                          </p>
                          <p className="text-sm text-gray-600">
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => {/* Navigate to grading page */}}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Grade Submissions
                        </button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(assignment.submittedBy / assignment.totalStudents) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default TeacherGradeAssignment; 