// models/LuckyDraw.js
const mongoose = require("mongoose");

const luckyDrawSchema = new mongoose.Schema({
  prize: { type: Number, default: 10000 },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  winner: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  isDrawDone: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("LuckyDraw", luckyDrawSchema);
