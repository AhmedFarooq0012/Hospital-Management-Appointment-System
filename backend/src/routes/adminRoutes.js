const express = require("express");
const {
  updateUserRole,
  updateHospitalInfo,
  getHospitalInfo,
} = require("../controllers/adminController.js");
const { protect, authorizeRoles } = require("../middleware/authMiddleware.js");

const router = express.Router();

// 1. Update User Role (Admin Only)
router.put("/users/:id/role", protect, authorizeRoles("admin"), updateUserRole);

// 2. Get Hospital Profile (Public View)
router.get("/hospital", getHospitalInfo);

// 3. Update Hospital Profile (Admin Only)
router.post("/hospital", protect, authorizeRoles("admin"), updateHospitalInfo);

// YEAH MISSING THA:
module.exports = router;
