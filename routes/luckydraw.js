const express = require("express");
const router = express.Router();
const User = require("../models/user");
const LuckyDraw = require("../models/LuckyDraw");

router.post("/join", async (req, res) => {
  try {
    const { name, email, phone, gender, address, terms } = req.body;

    if (!terms) {
      return res.status(400).json({ message: "You must agree to the terms and conditions." });
    }

    // Create user
    const user = await User.create({ name, email, phone, gender, address, terms });
    
    // Get current lucky draw
    let luckyDraw = await LuckyDraw.findOne();

    if (!luckyDraw) {
        luckyDraw = new LuckyDraw();
    }

    // 🔒 Check if draw is already done
    if (luckyDraw && luckyDraw.isDrawDone) {
      return res.status(400).json({ message: "Lucky draw is already completed. Cannot join now." });
    }

    // Push participant
    luckyDraw.participants.push(user._id);
    await luckyDraw.save();

    res.status(200).json({ message: "Joined successfully!", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong while joining" });
  }
});


// Step 2b: Draw route (Winner select)
router.post("/draw", async (req, res) => {
  try {
    const luckyDraw = await LuckyDraw.findOne().populate("participants");
    if (!luckyDraw || luckyDraw.isDrawDone) return res.json({ message: "Draw already done or no participants" });

    const participants = luckyDraw.participants;
    const winnerIndex = Math.floor(Math.random() * participants.length);
    const winner = participants[winnerIndex];

    luckyDraw.winner = winner._id;
    luckyDraw.isDrawDone = true;
    await luckyDraw.save();

    res.json({ message: "Winner selected!", winner });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Step 2c: Participants route
router.get("/participants", async (req, res) => {
  const luckyDraw = await LuckyDraw.findOne().populate("participants");
  res.json({ participants: luckyDraw ? luckyDraw.participants : [] });
});

module.exports = router;
