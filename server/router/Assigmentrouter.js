const express=require("express")
const router=express.Router()
const upload = require("../lib/multer.js");
const {createAssgiment, getAssignmentsByTeacherId, getAssignmentById}=require('../controller/AssigmentController')


router.post("/createAssgiment", upload.single("attachments"), createAssgiment);
router.get("/teacher/:teacherId", getAssignmentsByTeacherId);
router.get("/assignmentbyId/:assignmentId", getAssignmentById);





module.exports=router