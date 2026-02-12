const express = require("express");
const router = express.Router();
const Experience = require("../models/Experience");
const verifyToken = require("../middleware/authMiddleware");

router.post("/add-experience", verifyToken, async (req, res) => {
  const exp = new Experience(req.body);
  await exp.save();
  res.json({ msg: "Experience added" });
});

router.get("/get-experience", async (req, res) => {
  const data = await Experience.find().sort({ createdAt: -1 });
  res.json(data);
});

router.put("/edit-experience/:id", verifyToken, async (req, res) => {
  await Experience.findByIdAndUpdate(req.params.id, req.body);
  res.json({ msg: "Experience updated" });
});

router.delete("/delete-experience/:id", verifyToken, async (req, res) => {
  await Experience.findByIdAndDelete(req.params.id);
  res.json({ msg: "Experience deleted" });
});

module.exports = router;
