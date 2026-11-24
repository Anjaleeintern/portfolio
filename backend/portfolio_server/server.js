// Portfolio API Server
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());// Allow all origins for now, we will restrict in production
app.use(express.json()); // allows req.body

app.use(cors({
  origin: "*",  // we will secure later
  credentials: true // allow cookies if needed
}));

// Static folder for images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================= ROUTES ================= */
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projectRoutes");
const profileRoutes = require("./routes/profileRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const certificationsRoutes = require("./routes/certificationsRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/certifications", certificationsRoutes);


/* ================= DATABASE ================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

/* ================= TEST ROUTE ================= */
app.get("/", (req, res) => res.send("Portfolio API Running 🚀"));

/* ================= START SERVER ================= */
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
