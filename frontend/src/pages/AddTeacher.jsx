import { useFormik } from "formik";
import * as yup from "yup";
import { FiUpload, FiSave, FiX } from "react-icons/fi";
import TopNavbar from "../../../frontend/src/components/Topnavbar";
import { useDispatch, useSelector } from "react-redux";
import { AddTeacher } from "../features/Teacher";

const validationSchema = yup.object({
  Firstname: yup.string().required("Firstname is required"),
  Lastname: yup.string().required("Lastname is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  address: yup.string().required("Address is required"),
  dateOfBirth: yup.string().required("Date of birth is required"),
  Phone: yup
    .number()
    .typeError("Phone must be a number")
    .required("Phone number is required"),
  gender: yup.string().oneOf(["Male", "Female"]).required("Gender is required"),
});

function AddTeacherPage() {
  const dispatch = useDispatch();
  const { isTeacheradd } = useSelector((state) => state.Teacher);

  const formik = useFormik({
    initialValues: {
      Firstname: "",
      Lastname: "",
      email: "",
      address: "",
      dateOfBirth: "",
      Phone: "",
      gender: "",
    },
    validationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = (values) => {
    dispatch(AddTeacher(values));

    // formik.resetForm();
  };

  return (
    <>
      <TopNavbar />
      <h1 className="mt-10 ml-20 font-medium text-3xl text-gray-500">
        Add Teacher
      </h1>
      <hr className="mb-10 mt-5"></hr>
      <form
        onSubmit={formik.handleSubmit}
        className="max-w-4xl w-full mx-auto p-6 bg-white rounded-lg shadow-sm space-y-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M6 12L10 16L18 8" stroke="white" strokeWidth="2" />
            </svg>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 border text-blue-600 rounded-md hover:bg-blue-50"
          >
            <FiUpload /> Upload
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            "Firstname",
            "Lastname",
            "email",
            "address",
            "dateOfBirth",
            "Phone",
          ].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field === "dateOfBirth" ? "Date of Birth" : field}
              </label>
              <input
                type={field === "dateOfBirth" ? "date" : "text"}
                name={field}
                placeholder={`Enter your ${field}`}
                value={formik.values[field]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 py-2 border rounded-md"
              />
              {formik.touched[field] && formik.errors[field] && (
                <p className="text-red-500 text-sm">{formik.errors[field]}</p>
              )}
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {formik.touched.gender && formik.errors.gender && (
              <p className="text-red-500 text-sm">{formik.errors.gender}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 pt-6">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <FiSave /> Add Teacher
          </button>
          <button
            type="button"
            className="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-50 flex items-center gap-2"
          >
            <FiX /> Cancel
          </button>
        </div>
      </form>
    </>
  );
}

export default AddTeacherPage;
