

const express = require("express");
const router = express.Router();
const Profile = require("../models/profile");
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");


// 🔹 GET PROFILE
router.get("/", async (req, res) => {
  let profile = await Profile.findOne();

  if (!profile) {
    profile = await Profile.create({
      name: "Anjalee Bisen",
      title: "Full Stack Developer",
      bio: "AI Enthusiast",
      photo: "",
    });
  }

  res.json(profile);
});




router.put(
  "/update-photo",
  verifyToken,
  upload.single("photo"),
  async (req, res) => {
    try {
      console.log("FILE RECEIVED:", req.file);

      if (!req.file) {
        return res.status(400).json({ msg: "No file uploaded" });
      }

      const photoPath = `/uploads/${req.file.filename}`;
      console.log("PHOTO PATH:", photoPath);

      let profile = await Profile.findOne();
      console.log("PROFILE BEFORE UPDATE:", profile);

      if (!profile) {
        profile = await Profile.create({});
      }

      profile.photo = photoPath;
      await profile.save();

      console.log("PROFILE AFTER SAVE:", profile);

      res.json(profile);
    } catch (err) {
      console.log("PHOTO UPLOAD ERROR:", err);
      res.status(500).json({ msg: "Server crash" });
    }
  }
);


// 🔹 UPDATE RESUME

router.put(
  "/update-resume",
  verifyToken,
  upload.single("resume"),
  async (req, res) => {
    try {
      const resumePath = `/uploads/${req.file.filename}`;

      const profile = await Profile.findOneAndUpdate(
        {},
        { resume: resumePath },
        { new: true, upsert: true }
      );

      res.json(profile);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Resume upload failed" });
    }
  }
);

// UPDATE CONTACT INFO
router.put("/update-contact", verifyToken, async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      {},
      { contact: req.body },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ msg: "Contact update failed" });
  }
});

// GET CONTACT INFO
router.get("/get-contact", async (req, res) => {
  try {
    const profile = await Profile.findOne();
    res.json(profile?.contact || {});
  } catch (err) {
    res.status(500).json({ msg: "Error fetching contact" });
  }
});





router.post("/add-skill", verifyToken, async (req, res) => {
  try {
    const { title, items } = req.body;
    if (!title || !items || !items.length) {
      return res.status(400).json({ message: "Title and skills are required" });
    }

    const profile = await Profile.findOne();
    const newSkill = { title, items };
    profile.skills.push(newSkill);
    await profile.save();

    // return the updated skills array with _id
    res.status(200).json(profile.skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE SKILL
router.put("/update-skill/:id", verifyToken, async (req, res) => {
  try {
    const { title, items } = req.body;
    if (!title || !items || !items.length) {
      return res.status(400).json({ message: "Title and skills are required" });
    }

    const profile = await Profile.findOne();
    const skill = profile.skills.id(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    skill.title = title;
    skill.items = items;
    await profile.save();

    res.status(200).json(profile.skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE SKILL
router.delete("/delete-skill/:id", verifyToken, async (req, res) => {
  try {
    const skillId = req.params.id;
    if (!skillId) return res.status(400).json({ message: "Skill ID is required" });

    const profile = await Profile.findOne();
    const skillExists = profile.skills.some(s => s._id.toString() === skillId);
    if (!skillExists) return res.status(404).json({ message: "Skill not found" });

    profile.skills = profile.skills.filter(s => s._id.toString() !== skillId);
    await profile.save();

    res.status(200).json(profile.skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
