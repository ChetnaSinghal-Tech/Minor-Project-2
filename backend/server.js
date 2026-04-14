// require('dotenv').config();
// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db.js");
// const authRoutes = require("./routes/authRoutes");

// const app = express();

// const cors = require('cors');
// app.use(cors({
//     origin: 'https://donixprojexaai.netlify.app', // allow your frontend
//     methods: ['GET', 'POST', 'PUT', 'DELETE']
// }));
// app.use(cors()); // allow all origins
// app.use(express.json());

// connectDB();

// // This is the correct way to link your routes
// app.use("/api/auth", authRoutes);

// // If you want a test route in THIS file, use 'app', not 'router'
// app.get("/api/ping", (req, res) => res.send("Server is alive!"));

// app.get("/", (req, res) => {
//     res.send("🚀 Donix Backend is Live");
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(` Server running on port ${PORT}`));


require('dotenv').config();
const express = require("express");
const cors = require("cors"); // Line 3: Declared once here
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Use CORS only once with your specific configuration
app.use(cors({
    origin: 'https://donixprojexaai.netlify.app', 
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());

connectDB();

// Routes
app.use("/api/auth", authRoutes);

app.get("/api/ping", (req, res) => res.send("Server is alive!"));

app.get("/", (req, res) => {
    res.send("🚀 Donix Backend is Live");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));