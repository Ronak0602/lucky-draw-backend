const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const User = require("../models/user");

router.get("/", (req, res) => {
  res.send("Payment Route Working ✅");
});

// multer setup for proof upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/payments/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `proof-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage: storage });

// POST /payment/upload-proof/:userId
router.post("/upload-proof/:userId", upload.single("paymentProof"), async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("User ID from request:", userId); 
    const file = req.file;

    if (!file) {
      return res.status(400).json({ msg: "Payment proof file is required" });
    }

    const user = await User.findById(userId);
    console.log(user); 

    if (!user) return res.status(404).json({ msg: "User not found" });

    if (!user.hasPaid) {
      return res.status(400).json({ msg: "User has not made the payment yet" });
    }

    // user.hasPaid = true;
    user.paymentProof = file.path; // save proof file path
    user.transactionId = "TXN_" + Date.now();

    await user.save();

    res.json({ msg: "Payment updated with proof successfully", user });
  } catch (error) {
    res.status(500).json({ msg: "Error uploading proof", error: error.message });
  }
});

module.exports = router;
