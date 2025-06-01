import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopNavbar from '../components/Topnavbar';
import { useDispatch, useSelector } from "react-redux";
import { FiClock, FiCalendar, FiFileText, FiDownload, FiUpload, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { getAssignmentById } from "../features/Assignment";
import { motion } from 'framer-motion';
import { useEffect } from 'react';

function AssignmentDetails() {
  const { id } = useParams();
  const assignmentId = id
  
  const { assignments, isLoading } = useSelector((state) => state.Assignment);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const requirements = [
    "Show all work",
    "Include units where applicable",
    "Submit as PDF or DOC format",
    "Maximum file size: 10MB",
  ]
  const gradingCriteria = [
    { criterion: "Completeness", weight: "30%" },
    { criterion: "Accuracy", weight: "40%" },
    { criterion: "Presentation", weight: "20%" },
    { criterion: "Timeliness", weight: "10%" },
  ]
  
  
  

  useEffect(()=> {
    dispatch(getAssignmentById(assignmentId))
  }, [dispatch])

  console.log(assignments);

  

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'not-started':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );


  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {assignments?.assignment?.title}
                </h1>
                <p className="text-gray-600 mt-1">
                  {assignments?.assignment?.subject?.SubjectName}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  "not-started"
                )}`}
              >
                {"not-started".replace("-", " ")}
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-6">
            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Description
              </h2>
              <p className="text-gray-600">
                {assignments?.assignment?.description}
              </p>
            </div>

            {/* Due Date and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-gray-600">
                  <FiClock className="mr-2" />
                  <span>
                    Due Date:{" "}
                    {formatDate(
                      new Date(
                        assignments?.assignment?.dueDate
                      ).toLocaleString()
                    )}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-gray-600">
                  <FiCalendar className="mr-2" />
                  <span>Status: {"not-started".replace("-", " ")}</span>
                </div>
              </div>
            </div>

            {/* Attachments */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Attachments
              </h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <FiFileText className="text-gray-400 mr-2" />
                    <span className="text-gray-600">{`${assignments?.assignment?.title}.pdf`}</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800">
                    <a
                      href={assignments?.assignment?.attachments}
                      target="_blank"
                    >
                      <FiDownload className="w-5 h-5" />
                    </a>
                  </button>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Requirements
              </h2>
              <ul className="space-y-2">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <FiCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-600">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Grading Criteria */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Grading Criteria
              </h2>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Criterion
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Weight
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {gradingCriteria.map((criteria, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {criteria.criterion}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {criteria.weight}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={() =>
                  navigate(`/student/assignments/${assignmentId}/submit`)
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Start Assignment
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AssignmentDetails; 