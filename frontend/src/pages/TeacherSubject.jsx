import React, { useState, useEffect } from 'react';
import TopNavbar from "../../../frontend/src/components/Topnavbar";
import { FaBook, FaFlask, FaAtom, FaHistory, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import { FiSearch } from "react-icons/fi";
import {getSubjectById} from '../features/Subject'
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from 'react-router-dom';

function TeacherSubject() {
  // const { subjectId } = useParams();
  const [enrolled, setEnrolled] = useState([false, true, false, true]);
  const dispatch = useDispatch();
  
  const { Authuser } = useSelector((state) => state.auth);
  const { subjects} = useSelector((state) => state.Subject);
  const {className, setClassName} = useState('')
  console.log(subjects.SubjectName);
  const subjectId = Authuser.subject;
  console.log(subjectId);


  const toggleEnrollment = (index) => {
    const newEnrollmentStatus = [...enrolled];
    newEnrollmentStatus[index] = !newEnrollmentStatus[index];
    setEnrolled(newEnrollmentStatus);
  };

  const viewDetails = (className) => {
    alert(`Viewing details for ${className}`);
  };

  useEffect(() => {
        dispatch(getSubjectById(subjectId));
      }, [dispatch]);

  const classes = [
    {
      name: className,
      icon: <FaBook className="text-blue-500 text-4xl" />,
      grade: "A",
      description:
        "This is an introductory math class where students learn about algebra, geometry, and basic calculus concepts.",
      color: "bg-gray-100",
    },
    {
      name: "Physics 101",
      icon: <FaAtom className="text-blue-500 text-4xl" />,
      grade: "B",
      description:
        "Physics basics focusing on Newton's Laws, motion, and energy principles.",
      color: "bg-gray-100",
    },
    {
      name: "Chemistry 101",
      icon: <FaFlask className="text-blue-500 text-4xl" />,
      grade: "A+",
      description:
        "This class introduces the fundamentals of chemistry, including atoms, molecules, and chemical reactions.",
      color: "bg-gray-100",
    },
    {
      name: "History 101",
      icon: <FaHistory className="text-blue-500 text-4xl" />,
      grade: "B+",
      description:
        "An exploration of world history, focusing on key events and historical figures that shaped civilization.",
      color: "bg-gray-100",
    },
  ];

  // If subjectId is present, show only that subject's details
  // if (subjectId) {
  //   const index = parseInt(subjectId, 10) - 1;
  //   const subject = classes[index];
  //   if (!subject) {
  //     return (
  //       <div className="min-h-screen bg-gray-300">
  //         <TopNavbar />
  //         <div className="flex flex-col items-center justify-center h-64">
  //           <p className="text-gray-500 text-lg">Subject not found.</p>
  //           <Link to="/teacher/TeacherSubject" className="mt-4 text-blue-600 hover:underline">Back to Subjects</Link>
  //         </div>
  //       </div>
  //     );
  //   }
  //   return (
  //     <div className="min-h-screen bg-gray-300">
  //       <TopNavbar />
  //       <div className="container mx-auto px-4 py-8">
  //         <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-8">
  //           <div className="flex justify-between items-start mb-4">
  //             {subject.icon}
  //             <span className="px-3 py-1 bg-gray-800 text-white rounded-full text-sm font-semibold shadow-lg">{subject.grade}</span>
  //           </div>
  //           <h3 className="text-2xl font-bold text-gray-800 mb-2">{subject.name}</h3>
  //           <p className="text-gray-800 mb-4">{subject.description}</p>
  //           <div className="flex gap-4">
  //             <Link to="/teacher/TeacherSubject" className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Back</Link>
  //             {/* You can add more actions here, e.g., enroll/unenroll, etc. */}
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-300">
      <TopNavbar />

      <div className="container mx-auto px-4 py-8 mt-8">
        <h1 className="text-3xl font-bold text-black mb-8">My Classes</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            className={`${classes[0].color} rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105`}
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                {classes[0].icon}
                <span className="px-3 py-1 bg-gray-800 text-white rounded-full text-sm font-semibold shadow-lg">
                  {classes[0].grade}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mt-4">
                {subjects.SubjectName}
              </h3>
              <p className="text-gray-800 mt-2 text-sm">
                {classes[0].description}
              </p>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center text-blue-500">
                  <FaCheckCircle className="mr-2" />
                  <span className="font-medium">Enrolled</span>
                </div>

                <button className="flex items-center text-blue-400 hover:text-blue-600 transition-colors">
                  <FaInfoCircle className="mr-1" />
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherSubject;