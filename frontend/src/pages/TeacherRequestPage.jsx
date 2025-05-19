import React, { useState } from 'react';
import TopNavbar from '../components/Topnavbar';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiCheck, FiX, FiFileText, FiClock } from 'react-icons/fi';

function TeacherRequestPage() {
  // Mock data - would be replaced with actual API data
  const [requests] = useState([
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      subject: 'Mathematics',
      qualification: 'M.Sc. Mathematics',
      experience: '5 years',
      documents: [
        { name: 'resume.pdf', type: 'Resume' },
        { name: 'certificate.pdf', type: 'Qualification Certificate' }
      ],
      status: 'pending',
      submittedAt: '2024-03-15T10:30:00'
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+1987654321',
      subject: 'Physics',
      qualification: 'Ph.D. Physics',
      experience: '8 years',
      documents: [
        { name: 'resume.pdf', type: 'Resume' },
        { name: 'certificate.pdf', type: 'Qualification Certificate' },
        { name: 'publications.pdf', type: 'Research Publications' }
      ],
      status: 'approved',
      submittedAt: '2024-03-14T15:45:00'
    },
    {
      id: 3,
      firstName: 'Michael',
      lastName: 'Johnson',
      email: 'michael.j@example.com',
      phone: '+1122334455',
      subject: 'Chemistry',
      qualification: 'M.Sc. Chemistry',
      experience: '3 years',
      documents: [
        { name: 'resume.pdf', type: 'Resume' },
        { name: 'certificate.pdf', type: 'Qualification Certificate' }
      ],
      status: 'rejected',
      submittedAt: '2024-03-13T09:15:00'
    }
  ]);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async (requestId) => {
    setIsProcessing(true);
    try {
      // Here you would typically make an API call to approve the request
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Request approved successfully!');
      // Update the request status in the UI
      const updatedRequests = requests.map(req =>
        req.id === requestId ? { ...req, status: 'approved' } : req
      );
      // You would typically update the state here
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Error approving request. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (requestId) => {
    setIsProcessing(true);
    try {
      // Here you would typically make an API call to reject the request
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Request rejected successfully!');
      // Update the request status in the UI
      const updatedRequests = requests.map(req =>
        req.id === requestId ? { ...req, status: 'rejected' } : req
      );
      // You would typically update the state here
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Error rejecting request. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
            <h1 className="text-2xl font-bold text-gray-800">Teacher Registration Requests</h1>
            <p className="text-gray-600 mt-1">Review and manage teacher registration requests</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Requests List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">Pending Requests</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {requests.filter(r => r.status === 'pending').length} pending requests
                  </p>
                </div>
                <div className="divide-y divide-gray-200">
                  {requests.map((request) => (
                    <div
                      key={request.id}
                      onClick={() => setSelectedRequest(request)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 ${
                        selectedRequest?.id === request.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {request.firstName} {request.lastName}
                          </h3>
                          <p className="text-sm text-gray-600">{request.subject}</p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {request.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Request Details */}
            <div className="lg:col-span-2">
              {selectedRequest ? (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Request Details</h2>
                    <p className="text-sm text-gray-600">
                      Submitted on {formatDate(selectedRequest.submittedAt)}
                    </p>
                  </div>

                  {/* Personal Information */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <FiUser className="text-gray-400 mr-2" />
                        <span className="text-gray-600">
                          {selectedRequest.firstName} {selectedRequest.lastName}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FiMail className="text-gray-400 mr-2" />
                        <span className="text-gray-600">{selectedRequest.email}</span>
                      </div>
                      <div className="flex items-center">
                        <FiPhone className="text-gray-400 mr-2" />
                        <span className="text-gray-600">{selectedRequest.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Professional Information</h3>
                    <div className="space-y-2">
                      <p className="text-gray-600">
                        <span className="font-medium">Subject:</span> {selectedRequest.subject}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Qualification:</span> {selectedRequest.qualification}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Experience:</span> {selectedRequest.experience}
                      </p>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Submitted Documents</h3>
                    <div className="space-y-2">
                      {selectedRequest.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center">
                            <FiFileText className="text-gray-400 mr-2" />
                            <div>
                              <p className="text-sm text-gray-600">{doc.name}</p>
                              <p className="text-xs text-gray-500">{doc.type}</p>
                            </div>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800">
                            <FiDownload className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {selectedRequest.status === 'pending' && (
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => handleReject(selectedRequest.id)}
                        disabled={isProcessing}
                        className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <FiX className="mr-2" />
                        Reject
                      </button>
                      <button
                        onClick={() => handleApprove(selectedRequest.id)}
                        disabled={isProcessing}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <FiCheck className="mr-2" />
                        Approve
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-center h-full">
                  <p className="text-gray-500">Select a request to view details</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default TeacherRequestPage; 