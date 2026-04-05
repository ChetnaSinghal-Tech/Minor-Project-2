const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    blood: { type: String, required: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    // --- INDIAN PHONE VALIDATION ---
    phone: { 
        type: String, 
        required: true,
        validate: {
            validator: function(v) {
                // Regex: Starts with 6-9, followed by exactly 9 digits
                return /^[6-9]\d{9}$/.test(v);
            },
            message: props => `${props.value} is not a valid Indian phone number!`
        }
    },
    city: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' } 
});

module.exports = mongoose.model("Donor", donorSchema);