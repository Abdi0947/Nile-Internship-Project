const express = require("express");
const multer = require("multer");
const storage = multer.memoryStorage();

const upload = multer({ storage });
const router = express.Router();
const {
  UpdateProfile,
  DeleteProfile,
  GetAcadamicRecords,
  getallStudents,
  EditProfile

} = require("../controller/StudentController");

const { authmiddleware } = require("../middleware/Authmiddleware");

router.post(
  "/createStudentprofile",
  upload.single("profileImage"),
  UpdateProfile
);
router.get("/getallStudentprofile",getallStudents)

router.delete("/profile/:userId", DeleteProfile);
router.put("/updateProfile/:StudentId", EditProfile);

router.get("/academic-records", GetAcadamicRecords);

module.exports = router;
