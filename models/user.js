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
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true }, 
    address: { type: String, required: true },                                   
    terms: { type: Boolean, required: true, validate: v => v === true },
    hasPaid: { type: Boolean, default: false }, 
    transactionId: { type: String, default: "" }, 
    paymentProof: { type: String, default: "" } 
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
