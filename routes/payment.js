const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

// ✅ Route Check
router.get("/", (req, res) => {
  res.send("✅ Cashfree Payment Route Working");
});

// ✅ Create Cashfree Order
router.post("/create-cashfree-order", async (req, res) => {
  const {
    order_id,
    order_amount,
    customer_name,
    customer_email,
    customer_phone
  } = req.body;

  if (!order_id || !order_amount || !customer_email || !customer_phone) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const payload = {
    order_id,
    order_amount,
    order_currency: "INR",
    customer_details: {
      customer_id: customer_email,
      customer_email,
      customer_phone,
      customer_name,
    },
  };

  try {
    const response = await axios.post(
      `${process.env.CASHFREE_BASE_URL}/pg/orders`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "CASHFREE_APP_ID": process.env.CASHFREE_APP_ID,
          "CASHFREE_SECRET_KEY": process.env.CASHFREE_SECRET_KEY,
        },
      }
    );
       console.log("Cashfree response:", response.data); 
    res.status(200).json(response.data);
  } catch (error) {
    console.error(" Cashfree Error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Cashfree order creation failed" });
  }
});

module.exports = router;
