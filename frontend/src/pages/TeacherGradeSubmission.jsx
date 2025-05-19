import React, { useState } from 'react';
import TopNavbar from '../components/Topnavbar';
import { motion } from 'framer-motion';
import { FiFile, FiDownload, FiCheckCircle, FiXCircle } from 'react-icons/fi';

function TeacherGradeSubmission() {
  const [selectedAssignment] = useState({
    id: 1,
    title: 'Algebra Homework Set 4',
    class: 'Mathematics 101',
    dueDate: '2024-03-20',
    totalStudents: 25,
    submittedBy: 18
  });

  const [submissions] = useState([
    {
      id: 1,
      studentName: 'John Doe',
      submittedAt: '2024-03-19T14:30:00',
      files: [
        { name: 'homework.pdf', size: '2.4 MB' },
        { name: 'calculations.xlsx', size: '1.2 MB' }
      ],
      grade: null,
      feedback: '',
      status: 'pending'
    },
    {
      id: 2,
      studentName: 'Jane Smith',
      submittedAt: '2024-03-19T15:45:00',
      files: [
        { name: 'assignment.pdf', size: '3.1 MB' }
      ],
      grade: 85,
      feedback: 'Good work on the calculations, but could improve on the explanations.',
      status: 'graded'
    },
    // Add more submissions as needed
  ]);

  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Here you would typically submit the grade and feedback to the API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      alert('Grade submitted successfully!');
      
      // Reset form
      setGrade('');
      setFeedback('');
      setSelectedSubmission(null);
    } catch (error) {
      console.error('Error submitting grade:', error);
      alert('Error submitting grade. Please try again.');
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
            <h1 className="text-2xl font-bold text-gray-800">Grade Submissions</h1>
            <p className="text-gray-600 mt-1">{selectedAssignment.title} - {selectedAssignment.class}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Submissions List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">Submissions</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedAssignment.submittedBy} of {selectedAssignment.totalStudents} students
                  </p>
                </div>
                <div className="divide-y divide-gray-200">
                  {submissions.map((submission) => (
                    <div
                      key={submission.id}
                      onClick={() => setSelectedSubmission(submission)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 ${
                        selectedSubmission?.id === submission.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-800">{submission.studentName}</h3>
                          <p className="text-sm text-gray-600">
                            Submitted: {new Date(submission.submittedAt).toLocaleString()}
                          </p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          submission.status === 'graded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {submission.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Grading Panel */}
            <div className="lg:col-span-2">
              {selectedSubmission ? (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Grade Submission</h2>
                    <p className="text-sm text-gray-600">{selectedSubmission.studentName}</p>
                  </div>

                  {/* Submitted Files */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Submitted Files</h3>
                    <div className="space-y-2">
                      {selectedSubmission.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center">
                            <FiFile className="text-gray-400 mr-2" />
                            <span className="text-sm text-gray-600">{file.name}</span>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800">
                            <FiDownload className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Grading Form */}
                  <form onSubmit={handleGradeSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                        Grade
                      </label>
                      <input
                        type="number"
                        id="grade"
                        min="0"
                        max="100"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                        Feedback
                      </label>
                      <textarea
                        id="feedback"
                        rows={4}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>

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
                        {isSubmitting ? 'Submitting...' : 'Submit Grade'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-center h-full">
                  <p className="text-gray-500">Select a submission to grade</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default TeacherGradeSubmission; 