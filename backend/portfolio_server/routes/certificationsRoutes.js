// This file defines the routes for managing certifications in the portfolio server.

const router = require("express").Router();
const Certification = require("../models/Certificate");
const upload = require("../middleware/upload"); // Ensure this is the new Cloudinary middleware
const verifyToken = require("../middleware/authMiddleware");

/* GET ALL */
router.get("/get-certifications", async (req, res) => {
  const certs = await Certification.find().sort({ createdAt: -1 });
  res.json(certs);
});

// Health check route to verify server is running
router.get("/health", (req, res) => {
  res.status(200).send("OK");
});

/* ADD */
router.post("/add-certification", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const cert = new Certification({
      title: req.body.title,
      description: req.body.description,
      // CHANGE: Use req.file.path instead of req.file.filename
      image: req.file ? req.file.path : "", 
    });
    await cert.save();
    res.json({ msg: "Certification added", cert });
  } catch (err) {
    res.status(500).json({ msg: "Error adding certification" });
  }
});

/* EDIT */
router.put("/edit-certification/:id", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      description: req.body.description,
    };
    
    // CHANGE: Use req.file.path if a new file is uploaded
    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedCert = await Certification.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ msg: "Certification updated", updatedCert });
  } catch (err) {
    res.status(500).json({ msg: "Update failed" });
  }
});

/* DELETE */
router.delete("/delete-certification/:id", verifyToken, async (req, res) => {
  try {
    await Certification.findByIdAndDelete(req.params.id);
    res.json({ msg: "Certification deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Delete failed" });
  }
});

module.exports = router;