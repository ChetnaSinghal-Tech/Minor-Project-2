const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/save", authController.register);
router.post("/login", authController.login);
router.post("/request-blood", authController.sendBloodRequest);
// Add this to your existing routes/authRoutes.js
router.get("/user-profile/:email", authController.getProfile);
router.get("/search", authController.searchDonors);
router.get("/ping", (req, res) => res.send("Router is connected!"));
router.get("/my-requests", authController.getMyRequests);
// Add this to your existing routes
router.patch("/update-request-status", authController.updateRequestStatus);



module.exports = router;