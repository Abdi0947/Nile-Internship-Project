const express=require("express")
const router=express.Router()
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const {signup,login,updateProfile,logout, ForgotPassword, ResetPassword, updateUserInfo}=require('../controller/Authcontroller')
const {authmiddleware,Adminmiddleware,Managermiddleware,Teachermiddleware,Studentmiddleware}=require("../middleware/Authmiddleware")



router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
router.put(
  "/updateProfile",
  authmiddleware,
  updateProfile
);
router.put("/updateUserInfo",authmiddleware,updateUserInfo)

router.post("/forgot-password", ForgotPassword);
router.patch("/reset-password/:tokens", ResetPassword);





module.exports=router