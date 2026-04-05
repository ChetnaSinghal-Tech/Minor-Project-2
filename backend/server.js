require('dotenv').config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// This is the correct way to link your routes
app.use("/api/auth", authRoutes);

// If you want a test route in THIS file, use 'app', not 'router'
app.get("/api/ping", (req, res) => res.send("Server is alive!"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));