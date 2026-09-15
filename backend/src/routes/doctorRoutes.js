const express = require("express");
const {
  createOrUpdateProfile,
  getMyProfile,
  getAllDoctors,
} = require("../controllers/doctorController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Public route: Patients can view doctors list
router.get("/", getAllDoctors);

// Private routes
router.get("/me", protect, authorizeRoles("doctor"), getMyProfile);
router.post(
  "/profile",
  protect,
  authorizeRoles("doctor", "admin"),
  createOrUpdateProfile,
);

module.exports = router;
