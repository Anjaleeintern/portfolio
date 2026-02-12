const mongoose = require("mongoose");

const ExperienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  description: String,
  duration: String,
}, { timestamps: true });

module.exports = mongoose.model("Experience", ExperienceSchema);
