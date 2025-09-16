const express = require("express");
const router = express.Router();
const User = require("../models/user");

// ✅ Register API
router.post("/register", async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ msg: "Name and Phone required" });
    }

    const newUser = new User({
      name,
      phone,
      hasPaid: true, 
      transactionId: "DUMMY_" + Date.now() 
    });

    await newUser.save();

    res.status(201).json({ msg: "User registered successfully ✅", user: newUser });
  } catch (error) {
    res.status(500).json({ msg: "Error in registration", error: error.message });
  }
});

// ✅ Get all users (Admin use only)
router.get("/all", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching users", error: error.message });
  }
});

module.exports = router;
