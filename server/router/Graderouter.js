const express=require("express")
const router=express.Router()
const {createGrade,getallGrade,getGradeById,updateGrade ,deleteGrade}=require('../controller/Gradecontroller')


router.post("/createGrade",createGrade)
router.get("/getallGrader/:teacherId", getallGrade);
router.get('/getGrader/:GraderId',getGradeById);
router.put('/updateGrader/', updateGrade);
router.delete("/deleteGrader/:studentId", deleteGrade);





module.exports=router