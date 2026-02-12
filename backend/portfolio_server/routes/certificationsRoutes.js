const router = require("express").Router();
const Certification = require("../models/Certificate");
const upload = require("../middleware/upload");
const verifyToken = require("../middleware/authMiddleware");

/* GET ALL */
router.get("/get-certifications", async (req, res) => {
  const certs = await Certification.find().sort({ createdAt: -1 });
  res.json(certs);
});

/* ADD */
router.post("/add-certification", verifyToken, upload.single("image"), async (req, res) => {
  const cert = new Certification({
    title: req.body.title,
    description: req.body.description,
    image: req.file?.filename,
  });
  await cert.save();
  res.json({ msg: "Certification added" });
});

/* EDIT */
router.put("/edit-certification/:id", verifyToken, upload.single("image"), async (req, res) => {
  const updateData = {
    title: req.body.title,
    description: req.body.description,
  };
  if (req.file) updateData.image = req.file.filename;

  await Certification.findByIdAndUpdate(req.params.id, updateData);
  res.json({ msg: "Certification updated" });
});

/* DELETE */
router.delete("/delete-certification/:id", verifyToken, async (req, res) => {
  await Certification.findByIdAndDelete(req.params.id);
  res.json({ msg: "Certification deleted" });
});

module.exports = router;
