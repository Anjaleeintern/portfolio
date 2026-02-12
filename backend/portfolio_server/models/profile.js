const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
  title: { type: String, required: true },
  items: [{ type: String }],
}, { _id: true });

const ProfileSchema = new mongoose.Schema({
  name: String,
  title: String,
  bio: String,
  photo: String,
  resume: { type: String },
  contact: {
  phone: String,
  email: String,
  location: String,
  linkedin: String,
  github: String,
},
 skills: [SkillSchema],

}

);

module.exports = mongoose.model("Profile", ProfileSchema);
