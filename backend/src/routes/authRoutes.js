const express = require("express");
const { registerUser, loginUser ,verifyOTP } = require("../controllers/authController.js");
const router = express.Router();

// Auth Routes
router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser);

// Admin Routes

module.exports = router;
