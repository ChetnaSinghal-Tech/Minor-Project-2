const Donor = require("../models/Donor");
const bcrypt = require("bcrypt");
const Request = require("../models/Request");

// Registration Logic
exports.register = async (req, res) => {
    try {
        const { password, email } = req.body;
        
        // Check if user exists
        const existingUser = await Donor.findOne({ email });
        if (existingUser) return res.status(400).send("Email already registered.");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const donor = new Donor({
            ...req.body,
            password: hashedPassword,
            role: req.body.role || 'user'
        });

        await donor.save();
        res.status(201).send("Donor registered successfully");
    } catch (err) {
        res.status(500).send("Server Error during registration.");
    }
};

// Login Logic
// Login Logic - FIXED
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Donor.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        // 1. Calculate redirection logic FIRST
        const redirectPath = user.role === "admin" ? "../admin/admin.html" : "../user/user.html";
        const welcomeMsg = user.role === "admin" ? "Welcome Chief Admin" : "Welcome back, Hero!";

        // 2. Send EVERYTHING in one single response
        return res.status(200).json({
            message: "Login successful",
            welcomeMessage: welcomeMsg,
            redirect: redirectPath,
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role
            }
        });

    } catch (err) {
        console.error(err);
        // Ensure only one response is sent even in error
        if (!res.headersSent) {
            return res.status(500).json({ message: "Server Error" });
        }
    }
};

// Add this function to your controllers/authController.js
exports.getProfile = async (req, res) => {
    try {
        const user = await Donor.findOne({ email: req.params.email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Include 'role' so the frontend can double-check permissions
        const { name, blood, email, phone, city, role } = user;

        // Send the data back
        res.json({ 
            name, 
            blood, 
            email, 
            phone, 
            city, 
            role,
            donations: 0, // Placeholder until you build the donation system
            livesSaved: 0  // Placeholder
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

// Search for Donors
exports.searchDonors = async (req, res) => {
    try {
        const { blood, city } = req.query;
        let query = {};

        // Only filter if blood is provided and not 'all'
        if (blood && blood !== 'all') {
            query.blood = blood;
        }

        // Partial, case-insensitive match for city
        if (city) {
            query.city = new RegExp(city, 'i');
        }

        const donors = await Donor.find(query).select("-password");
        res.status(200).json(donors);
    } catch (err) {
        console.error("Search Controller Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};
// database alerts and notifications logic
exports.sendBloodRequest = async (req, res) => {
    try {
        const { donorId, senderId, requesterName, requesterContact, bloodType, message } = req.body;

        const newRequest = new Request({
            donorId,
            senderId, // ✅ now defined properly
            requesterName,
            requesterContact,
            bloodType,
            message,
            status: "pending" // 🔥 always set
        });

        await newRequest.save();

        res.status(201).json({ message: "Request sent successfully! The hero will be notified." });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to send request." });
    }
};

exports.getMyRequests = async (req, res) => {
    try {

        const { senderId } = req.query; 

        const myRequests = await Request.find({ senderId }).sort({ createdAt: -1 });
        
        // const { donorId } = req.query; 

        // const myRequests = await Request.find({ donorId }).sort({ createdAt: -1 });
        res.status(200).json(myRequests);
    } catch (err) {
        res.status(500).json({ message: "Error fetching requests" });
    }
};


exports.updateRequestStatus = async (req, res) => {
    try {
        const { requestId, status } = req.body;

        // Find the request by ID and update its status
        const updatedRequest = await Request.findByIdAndUpdate(
            requestId,
            { status: status },
            { new: true } // Returns the updated document
        );

        if (!updatedRequest) {
            return res.status(404).json({ message: "Request not found" });
        }

        res.status(200).json({ 
            message: `Request ${status} successfully!`, 
            request: updatedRequest 
        });
    } catch (err) {
        console.error("Update Status Error:", err);
        res.status(500).json({ message: "Server error updating status" });
    }
};