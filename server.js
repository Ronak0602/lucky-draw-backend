const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

// Create app
const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use('/uploads', express.static('uploads'));

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

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

console.log("MONGO_URI:", process.env.MONGO_URI); 

async function connectDB() {
  if (cached.conn) return cached.conn;  

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 120000 
    })
      .then((mongoose) => mongoose)  // Successful connection
      .catch(async (err) => {
        console.error("MongoDB connection failed, retrying in 5 seconds...");
        await new Promise(resolve => setTimeout(resolve, 5000));
        return connectDB();  // Retry the connection
      });
  }

  cached.conn = await cached.promise; 
  return cached.conn;  // Return the connected instance
}

// Connect DB once at startup
connectDB().then(() => {
  console.log("MongoDB connected");
  // Start the server after DB connection
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error("MongoDB connection error:", err);
});

// Export app for Vercel serverless
module.exports = app;
