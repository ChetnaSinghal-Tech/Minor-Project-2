const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor', required: true },

    // 🔥 ADD THIS
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor', required: true },

    requesterName: { type: String, required: true },
    requesterContact: { type: String, required: true },

    bloodType: { type: String, required: true },
    message: { type: String },

    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'], // 🔥 better
        default: 'pending'
    },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Request", RequestSchema);


// const RequestSchema = new mongoose.Schema({
//     donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor', required: true },
//     requesterName: { type: String, required: true },
//     requesterContact: { type: String, required: true },
//     bloodType: { type: String, required: true },
//     message: { type: String },
//     status: { type: String, default: 'pending' }, // pending, accepted, rejected
//     createdAt: { type: Date, default: Date.now }
// });