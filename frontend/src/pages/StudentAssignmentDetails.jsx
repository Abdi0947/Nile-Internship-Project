import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiDownload, FiBookOpen, FiCalendar, FiFileText } from 'react-icons/fi';
import { useDispatch, useSelector } from "react-redux";
import { getAllAssignments } from "../features/Assignment";



function StudentAssignmentDetails() {
  const dispatch = useDispatch();
  const { Authuser } = useSelector((state) => state.auth);
  const id = Authuser?.classId || "";
  const { assignments, isLoading } = useSelector((state) => state.Assignment);
  const { assignmentId } = useParams();
  const [Allassignments, setAssignment] = useState([]);

  let yourAssigment = assignments?.assignment?.filter(
    (el) => el?.ClassId?._id === id
  );
  let myAssignments = yourAssigment?.map((el) => ({
    id: el?._id,
    title: el?.title,
    course: el?.subject?.SubjectName,
    dueDate: new Date(el?.dueDate).toLocaleString(),
    description: el?.description,
    fileUrl: el?.attachments,
  }));

  
  useEffect(()=> {
      dispatch(getAllAssignments())
      setAssignment(myAssignments)
      
    }, [dispatch])
    console.log(assignments)

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <>
      {Allassignments?.map((assignment) => (
        <div
          key={assignment?.id}
          className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-10"
        >
          <div className="flex items-center mb-6">
            <FiBookOpen className="text-blue-600 text-3xl mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">
              {assignment?.title}
            </h2>
          </div>
          <div className="flex items-center text-gray-600 mb-4">
            <FiFileText className="mr-2" />
            <span className="font-medium mr-6">{assignment?.course}</span>
            <FiCalendar className="mr-2" />
            <span>
              Due:{" "}
              <span className="font-semibold text-red-500">
                {assignment?.dueDate}
              </span>
            </span>
          </div>
          <p className="text-lg text-gray-800 mb-6 leading-relaxed border-l-4 border-blue-200 pl-4 bg-blue-50 py-2">
            {assignment?.description}
          </p>
          {assignment?.fileUrl && (
            <a
              href={assignment?.fileUrl}
              download
              target="_blank"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors text-lg font-semibold"
            >
              <FiDownload className="mr-2 text-xl" /> Download Assignment
            </a>
          )}
        </div>
      ))}
    </>
  );
}

export default StudentAssignmentDetails; 