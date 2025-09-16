const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                console.log("Validating phone number:", v);
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid 10 digit phone number!`
        }
    },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },  // Added gender
    address: { type: String, required: true },                                    // Added address
    terms: { type: Boolean, required: true, validate: v => v === true },
    hasPaid: { type: Boolean, default: false }, // 1 rupiya diya ya nahi
    transactionId: { type: String, default: "" } // baad me Razorpay ya dummy
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
