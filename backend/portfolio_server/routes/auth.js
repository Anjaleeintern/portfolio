const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

// REGISTER ADMIN
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).send("Email or password missing");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    password: hashedPassword,
    isAdmin: true
  });

  await user.save();
  res.status(201).send("Admin registered");
});

// LOGIN ADMIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Wrong password" });
  
  const token = jwt.sign(
  { id: user._id, isAdmin: user.isAdmin },  // 👈 ADD isAdmin
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

  res.json({ token });
});



module.exports = router;
