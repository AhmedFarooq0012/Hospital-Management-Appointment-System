const express = require("express");
const {
  bookAppointment,
  getMyAppointments,
  updateAppointmentStatus,
} = require("../controllers/appointmentController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect); // Ensure user is logged in for all routes

router.post("/", authorizeRoles("patient"), bookAppointment);
router.get("/my-appointments", getMyAppointments);
router.put("/:id/status", updateAppointmentStatus);

module.exports = router;
