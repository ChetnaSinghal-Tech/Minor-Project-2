const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb+srv://chetnaadmin:chetna123@autosyllabus-cluster.a7dbfzn.mongodb.net/?appName=autosyllabus-cluster")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

// Schema
const donorSchema = new mongoose.Schema({
name:String,
blood:String,
email:String,
phone:String,
city:String
});

// Model
const Donor = mongoose.model("Donor", donorSchema);

// Route
app.post("/save", async (req,res)=>{

console.log("Data received:", req.body);  

const donor = new Donor(req.body);

await donor.save();

res.send("Donor registered successfully");

});

app.listen(3000, ()=>{
console.log("Server running on port 3000");
});