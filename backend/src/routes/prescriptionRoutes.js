const express = require("express");
const {
  saveOrUpdatePrescription,
  sendPrescriptionEmail,
} = require("../controllers/prescriptionController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// 1. Doctor iteratively saves or updates prescription
router.post(
  "/save",
  protect,
  authorizeRoles("doctor"),
  saveOrUpdatePrescription,
);

// 2. Doctor finalizing & triggering Email with PDF
router.post(
  "/send-email/:appointmentId",
  protect,
  authorizeRoles("doctor"),
  sendPrescriptionEmail,
);

module.exports = router;

