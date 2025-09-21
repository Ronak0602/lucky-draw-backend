const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/", (req, res) => {
  res.send("Payment Route Working ✅");
});

// POST /payment/confirm-payment/:userId
router.post("/confirm-utr/:userId", async (req, res) => {
  console.log("Confirm UTR route hit with userId:", req.params.userId);
  try {
    const { userId } = req.params;
    const { utrId } = req.body;

    if (!utrId) {
      return res.status(400).json({ msg: "UTR ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.transactionId = utrId;
    user.hasPaid = true;

    await user.save();

    res.json({ msg: "Congratulations! You have joined the contest.", user });
  } catch (error) {
    res.status(500).json({ msg: "Error confirming payment", error: error.message });
  }
});

module.exports = router;
