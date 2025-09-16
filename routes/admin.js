const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Admin Route Working ✅");
});

module.exports = router;  
