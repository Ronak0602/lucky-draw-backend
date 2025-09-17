const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

// Create app
const app = express();
app.use(express.json());
app.use(cors({ origin: "*" })); // allow all origins

// Routes import
const paymentRoutes = require("./routes/payment");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const luckyDrawRoutes = require("./routes/luckydraw");

// Routes
app.get("/", (req, res) => {
  res.send({
    message: "API is running...",
    activeStatus: "success",
    error: false
  });
});
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/luckydraw", luckyDrawRoutes);

// Serverless-friendly MongoDB connection
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };
// Yqq9CBXBCpmsu4bH

console.log("MONGO_URI:", process.env.MONGO_URI); // Debugging line
async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI)
      .then(mongoose => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Connect DB once at startup (optional for serverless, can call in each route)
connectDB().then(() => console.log("MongoDB connected"))
           .catch(err => console.error("MongoDB connection error:", err));

// Export app for Vercel serverless
module.exports = app;
