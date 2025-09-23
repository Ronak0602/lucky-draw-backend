const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();
const User = require("../models/user");

// ✅ Route Check
router.get("/", (req, res) => {
  res.send("✅ Cashfree Payment Route Working");
});

// ✅ Create Cashfree Order
router.post("/create-cashfree-order", async (req, res) => {
  const {
    order_id,
    order_amount,
    order_currency,
    customer_details
  } = req.body;

  console.log("order_id:", order_id);
  console.log("order_amount:", order_amount);
  console.log("customer_details:", customer_details);

  if (!order_id || !order_amount || !customer_details) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const {
    customer_id,
    customer_email,
    customer_phone,
    customer_name
  } = customer_details;


  console.log("customer_id:", customer_id);
  console.log("customer_email:", customer_email);
  console.log("customer_phone:", customer_phone);
  console.log("customer_name:", customer_name);

  if (!customer_id || !customer_email || !customer_phone || !customer_name) {
    return res.status(400).json({ error: "Missing customer details" });
  }

  const payload = {
    order_id,
    order_amount: order_amount.toString(),
    order_currency: order_currency || "INR",
    customer_details: {
      customer_id,
      customer_email,
      customer_phone,
      customer_name,
    },
    payment_method: {
      upi: {
        mode: "collect" 
      }
    }
  };


  try {
    const response = await axios.post(
      `${process.env.CASHFREE_BASE_URL}/pg/orders`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2022-09-01"
        },
      }
    );
    console.log("Cashfree response:", response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error(" Cashfree Error:", error?.response?.data || error.message);
    res.status(500).json({
      error: "Cashfree order creation failed",
      details: error?.response?.data || error.message,
    });
  }
});

// ✅ Verify Payment & Update User Status
router.post("/verify-payment", async (req, res) => {
  const { userId, paymentStatus, transactionId, paymentProof } = req.body;

  try {
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // If payment was successful
    if (paymentStatus === "success") {
      user.hasPaid = true;
      user.transactionId = transactionId || "";
      user.paymentProof = paymentProof || "";
    }

    // Save the updated user document
    await user.save();

    res.status(200).json({ msg: "Payment verified and user updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error verifying payment", error: err.message });
  }
});


module.exports = router;
