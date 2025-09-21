const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Razorpay = require('razorpay');
const crypto = require('crypto');

require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.get("/", (req, res) => {
  res.send("Payment Route Working ✅");
});


router.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  if (!amount) {
    return res.status(400).json({ msg: "Amount is required" });
  }

  const options = {
    amount: amount * 100, // in paise
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ msg: "Error creating Razorpay order", error: err.message });
  }
});

  router.post("/verify", async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    userId,
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ msg: "User not found" });

      user.hasPaid = true;
      user.transactionId = razorpay_payment_id;
      await user.save();

      res.status(200).json({ success: true, msg: "Payment verified", user });
    } catch (err) {
      res.status(500).json({ msg: "Error saving payment", error: err.message });
    }
  } else {
    res.status(400).json({ success: false, msg: "Invalid signature" });
  }
});


module.exports = router;
