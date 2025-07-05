const express = require("express");
const router = express.Router();
const {
  getallClass, getClassById
} = require("../controller/ClassController");

router.get("/getallclass", getallClass);
router.get("/getClassById/:classId", getClassById);

module.exports = router;
