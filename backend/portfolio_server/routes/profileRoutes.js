

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
res.set("Cache-Control", "public, max-age=300");

  res.json(profile);
});



router.put(
  "/update-photo",
  verifyToken,
  upload.single("photo"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ msg: "No file uploaded" });
      }

      // CHANGE THIS: Instead of /uploads/filename, use req.file.path
      // req.file.path is the full URL provided by Cloudinary
      const photoPath = req.file.path; 

      let profile = await Profile.findOne();
      if (!profile) {
        profile = await Profile.create({});
      }

      profile.photo = photoPath;
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.log("PHOTO UPLOAD ERROR:", err);
      res.status(500).json({ msg: "Server crash" });
    }
  }
);




router.put(
  "/update-resume",
  verifyToken,
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ msg: "No file uploaded" });
      }

      // CHANGE THIS: Use the Cloudinary URL
      const resumePath = req.file.path;

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




// ADD SKILL
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

// GET ABOUT DATA
router.get("/get-about", async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    }

    const defaultAbout = {
      description: "I am a passionate Full Stack MERN Developer with practical experience in building responsive and scalable web applications using React, Node.js, Express, and MongoDB.\n\nI have developed full-stack projects that include authentication using JWT, REST API integration, database management with MongoDB, and deployment on cloud platforms like Render.",
      subDescription: "I enjoy solving problems, building efficient backend systems, and designing clean user interfaces that enhance user experience.\n\nAs a fresher, I am actively looking for internship or entry-level developer opportunities where I can contribute my skills and grow in a collaborative and professional environment.",
      badges: ["🚀 Fast Learner", "🤖 AI Enthusiast", "💡 Problem Solver"],
      image: "/lapi.png"
    };

    const aboutData = {
      description: profile.about?.description || defaultAbout.description,
      subDescription: profile.about?.subDescription || defaultAbout.subDescription,
      badges: (profile.about?.badges && profile.about.badges.length > 0) ? profile.about.badges : defaultAbout.badges,
      image: profile.about?.image || defaultAbout.image
    };

    res.json(aboutData);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching about data: " + err.message });
  }
});

// UPDATE ABOUT DATA
router.put("/update-about", verifyToken, async (req, res) => {
  try {
    const { description, subDescription, badges, image } = req.body;

    let processedBadges = badges;
    if (typeof badges === "string") {
      processedBadges = badges.split(",").map(b => b.trim()).filter(Boolean);
    }

    const updateData = {
      "about.description": description !== undefined ? description : "",
      "about.subDescription": subDescription !== undefined ? subDescription : "",
      "about.badges": Array.isArray(processedBadges) ? processedBadges : [],
    };
    if (image !== undefined && image !== "") {
      updateData["about.image"] = image;
    }

    const profile = await Profile.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true }
    );

    res.json(profile.about);
  } catch (err) {
    res.status(500).json({ msg: "About update failed: " + err.message });
  }
});

module.exports = router;
