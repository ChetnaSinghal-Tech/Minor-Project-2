const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb+srv://chetnaadmin:chetna123@autosyllabus-cluster.a7dbfzn.mongodb.net/donix_db?appName=autosyllabus-cluster")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("Connection Error:", err));

const donorSchema = new mongoose.Schema({
    name: String,
    blood: String,
    email: { type: String, unique: true },
    phone: String,
    city: String,
    password: { type: String, required: true },
    role: { type: String, default: 'user' } 
});

const Donor = mongoose.model("Donor", donorSchema);

// --- REGISTRATION ROUTE ---
app.post("/save", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const donor = new Donor({
            ...req.body,
            password: hashedPassword,
            role: req.body.role || 'user'
        });

        await donor.save();
        res.send("Donor registered successfully");
    } catch (err) {
        res.status(500).send("Registration failed. Email might already exist.");
    }
});

// --- NEW: LOGIN ROUTE (The "Traffic Cop") ---
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Donor.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check password (assuming you used bcrypt to hash it during registration)
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (isMatch) {
            // Check Role and send the specific path you requested
            if (user.role === "admin") {
                return res.json({ 
                    redirect: "../admin/admin.html", 
                    role: "admin",
                    message: "Welcome Chief Admin" 
                });
            } else {
                return res.json({ 
                    // Your specific user route
                    redirect: "../user/user.html", 
                    role: "user",
                    message: "Welcome back, Hero!" 
                });
            }
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// GET USER DETAILS BY EMAIL
// app.get("/user-profile/:email", async (req, res) => {
//     try {
//         const user = await Donor.findOne({ email: req.params.email });
//         if (!user) return res.status(404).send("User not found");
        
//         // Send back everything except the password for security
//         const { name, blood, email, phone, city } = user;
//         res.json({ name, blood, email, phone, city });
//     } catch (err) {
//         res.status(500).send("Server Error");
//     }
// });

app.listen(3000, () => console.log("Server running on port 3000"));