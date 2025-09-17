const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require('cors');


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// routes import
const paymentRoutes = require("./routes/payment");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const luckyDrawRoutes = require("./routes/luckydraw");


app.get("/", (req, res) => {
  res.send({
    message: "API is running...",
    activeStatus: "success",
    error : false
  });
});
// use routes
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/luckydraw", luckyDrawRoutes);


// db connect
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
