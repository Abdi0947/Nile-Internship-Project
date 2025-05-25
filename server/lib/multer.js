const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./Cloudinary.js");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "assignments",
    allowed_formats: ["pdf", "doc", "docx", "ppt", "pptx"],
  },
});

const upload = multer({ storage });

module.exports = upload;