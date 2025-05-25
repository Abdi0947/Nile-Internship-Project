const express=require("express")
const router=express.Router()
const {createTeacherprofile,getTeacher,searchTeacher,getTeacherById,updateTeacher,deleteTeacher, editProfile, editPassword}=require('../controller/Teachercontroller')


router.post("/TeacherProfile",createTeacherprofile)
router.get('/getallTeacher', getTeacher);
router.get('/getTeacher/:TeacherId', getTeacherById);
router.put('/updateTeacher/:TeacherId', updateTeacher);
router.put("/editTeacherProfile/:TeacherId", editProfile);
router.put("/editPassword/:TeacherId", editPassword);
router.delete('/deleteTeacher/:TeacherId', deleteTeacher);
router.get('/searchTeacher',searchTeacher)




module.exports=router