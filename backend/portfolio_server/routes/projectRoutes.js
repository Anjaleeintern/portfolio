const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const verifyToken = require("../middleware/authMiddleware");

// ✅ GET
router.get("/get-projects", async (req, res) => {
  const projects = await Project.find({ is_visible: true }).sort({ createdAt: -1 });
  res.json(projects);
});

// ✅ ADD
router.post("/add-project", verifyToken, async (req, res) => {
  const project = new Project(req.body);
  await project.save();
  res.json(project);
});

// ✅ DELETE
router.delete("/delete-project/:id", verifyToken, async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

// ✅ EDIT
router.put("/edit-project/:id", verifyToken, async (req, res) => {
  const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

module.exports = router;
