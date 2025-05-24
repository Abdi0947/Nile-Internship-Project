const express = require("express");
const router = express.Router();
const {
  getallClass
} = require("../controller/ClassController");

router.get("/getallclass", getallClass);

module.exports = router;
