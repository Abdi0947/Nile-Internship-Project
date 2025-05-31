const express=require("express")
const router=express.Router()
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const {signup,login,updateProfile,logout, ForgotPassword, ResetPassword, updateUserInfo, googleLogin}=require('../controller/Authcontroller')
const {authmiddleware,Adminmiddleware,Managermiddleware,Teachermiddleware,Studentmiddleware}=require("../middleware/Authmiddleware")



router.post("/signup",signup)
router.post("/login",login)
router.post("/googleLogin", googleLogin);
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