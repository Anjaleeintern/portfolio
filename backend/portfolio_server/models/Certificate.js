const mongoose = require("mongoose");

const certificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String }, // filename
}, { timestamps: true });

module.exports = mongoose.model("Certification", certificationSchema);
