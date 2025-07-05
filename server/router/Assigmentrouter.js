const express=require("express")
const router=express.Router()
const upload = require("../lib/multer.js");
const {createAssgiment, getAssignmentsByTeacherId, getAssignmentById, getAllAssignments, submitAssignment, deleteAssignment,getSubmitAssignmentById}=require('../controller/AssigmentController')


router.post("/createAssgiment", upload.single("attachments"), createAssgiment);
router.post("/submitAssgiment", upload.single("attachments"), submitAssignment);
router.get("/getAll", getAllAssignments);
router.get("/teacher/:teacherId", getAssignmentsByTeacherId);
router.get("/assignmentbyId/:assignmentId", getAssignmentById);
router.get("/getSubmitAssignmentbyId/:assignmentId", getSubmitAssignmentById);
router.delete("/deleteAssignment/:teacherId", deleteAssignment);





module.exports=router