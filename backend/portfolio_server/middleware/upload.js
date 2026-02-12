


const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists


const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer storage configuration

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter to allow only images and PDFs
const fileFilter = (req, file, cb) => {
  const allowed = /jpg|jpeg|png|pdf/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  if (ext) cb(null, true);
  else cb("Only images & pdf allowed");
};


const upload = multer({ storage ,fileFilter});

module.exports = upload;
