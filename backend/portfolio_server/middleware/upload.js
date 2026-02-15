


// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const multer = require('multer');

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_KEY,
//   api_secret: process.env.CLOUDINARY_SECRET
// });

// // Configure Storage to Cloudinary instead of local disk
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'portfolio_uploads', // This is the folder name in Cloudinary
//     resource_type: "auto",
//     allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
//   },
// });

// res.json({ photo: req.file.path });

// const upload = multer({ storage });

// module.exports = upload;



const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Configure storage for Multer to use Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio_uploads', // Folder in Cloudinary
    resource_type: 'auto',        // Detect type automatically
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'], // Allowed file types
  },
});

// Multer middleware
const upload = multer({ storage });

module.exports = upload;
