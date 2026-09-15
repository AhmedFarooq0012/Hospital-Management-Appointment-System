const Appointment = require("../models/Appointment.model");
const DoctorProfile = require("../models/DoctorProfile.model");
const User = require("../models/User.model");
const sendEmail = require("../utils/sendEmail");
const Hospital = require("../models/Hospital.model");

// @desc    Book a new appointment (Sends Email to Patient Only)
// @route   POST /api/appointments
// @access  Private (Patient only)
/*
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeslot, problemDescription } = req.body;

    if (!doctorId || !date || !timeslot) {
      return res
        .status(400)
        .json({ message: "Doctor, Date, and Timeslot are required" });
    }

    // 1. Doctor Profile check karein
    const doctorProfile = await DoctorProfile.findOne({ user: doctorId });
    if (!doctorProfile || !doctorProfile.isApproved) {
      return res
        .status(404)
        .json({ message: "Doctor profile not found or not active" });
    }

    // 2. Check slot existence in doctor's profile
    if (!doctorProfile.timeSlots.includes(timeslot)) {
      return res
        .status(400)
        .json({ message: "Selected time slot is not offered by this doctor" });
    }

    // 3. Create Appointment Record
    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date,
      timeslot,
      problemDescription,
    });

    // 4. Send Confirmation Email ONLY to Patient
    const doctorUser = await User.findById(doctorId);
    const appointmentDate = new Date(date).toDateString();

    const emailContent = `
      <h2>Appointment Confirmation</h2>
      <p>Dear <strong>${req.user.name}</strong>,</p>
      <p>Your appointment has been successfully booked!</p>
      <ul>
        <li><strong>Doctor:</strong> Dr. ${doctorUser.name}</li>
        <li><strong>Specialization:</strong> ${doctorProfile.specialization}</li>
        <li><strong>Date:</strong> ${appointmentDate}</li>
        <li><strong>Time Slot:</strong> ${timeslot}</li>
        <li><strong>Clinic Address:</strong> ${doctorProfile.clinicAddress}</li>
      </ul>
      <p>Please reach 10 minutes prior to your timeslot.</p>
    `;

    await sendEmail({
      email: req.user.email,
      subject: "Appointment Confirmation - Doctor Appointment System",
      html: emailContent,
    });

    res.status(201).json({
      success: true,
      message:
        "Appointment booked successfully! Confirmation email sent to your email.",
      data: appointment,
    });
  } catch (error) {
    // Unique Compound Index Handle (Double Booking Guard)
    if (error.code === 11000) {
      return res.status(400).json({
        message:
          "This time slot is already booked for this doctor on the selected date.",
      });
    }
    res.status(500).json({ message: error.message });
  }
};
*/

const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeslot, problemDescription } = req.body;

    if (!doctorId || !date || !timeslot) {
      return res
        .status(400)
        .json({ message: "Doctor, Date, and Timeslot are required" });
    }

    // 1. Doctor Profile check karein
    const doctorProfile = await DoctorProfile.findOne({ user: doctorId });
    if (!doctorProfile || !doctorProfile.isApproved) {
      return res
        .status(404)
        .json({ message: "Doctor profile not found or not active" });
    }

    // 2. Check slot existence in doctor's profile
    if (!doctorProfile.timeSlots.includes(timeslot)) {
      return res
        .status(400)
        .json({ message: "Selected time slot is not offered by this doctor" });
    }

    // 3. Database se Hospital Profile details query karein
    let hospital = await Hospital.findOne();
    if (!hospital) {
      hospital = {
        name: "CITY HOSPITAL",
        address: "123 Healthcare Ave, Medical District",
        phone: "+123-456-7890",
        emergencyPhone: "+123-999-9111",
        email: "info@hospital.com",
        timings: "Mon - Sat: 08:00 AM - 10:00 PM | Sun: Emergency Only",
      };
    }

    // 4. Create Appointment Record
    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date,
      timeslot,
      problemDescription,
    });

    // 5. Send Confirmation Email with Hospital Header & Timings
    const doctorUser = await User.findById(doctorId);
    const appointmentDate = new Date(date).toDateString();

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
        <!-- HOSPITAL HEADER -->
        <div style="text-align: center; border-bottom: 2px solid #0056b3; padding-bottom: 15px; margin-bottom: 20px;">
          <h1 style="color: #0056b3; margin: 0; font-size: 24px; text-transform: uppercase;">${hospital.name}</h1>
          <p style="color: #555555; font-size: 13px; margin: 5px 0 0 0;">${hospital.address}</p>
          <p style="color: #555555; font-size: 12px; margin: 3px 0 0 0;">
            <strong>Phone:</strong> ${hospital.phone} | <strong>Emergency:</strong> <span style="color: #d9534f;">${hospital.emergencyPhone}</span>
          </p>
          <p style="color: #555555; font-size: 12px; margin: 3px 0 0 0;"><strong>Email:</strong> ${hospital.email}</p>
        </div>

        <!-- CONFIRMATION BODY -->
        <h2 style="color: #2c3e50; text-align: center; margin-bottom: 20px;">Appointment Confirmation</h2>
        <p style="font-size: 15px; color: #333333;">Dear <strong>${req.user.name}</strong>,</p>
        <p style="font-size: 14px; color: #555555; line-height: 1.5;">
          Your appointment has been successfully booked! Below are your booking details:
        </p>

        <!-- BOOKING DETAILS TABLE -->
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #333333;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 35%;">Doctor:</td>
              <td style="padding: 6px 0;">Dr. ${doctorUser.name}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Specialization:</td>
              <td style="padding: 6px 0;">${doctorProfile.specialization}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Date:</td>
              <td style="padding: 6px 0;">${appointmentDate}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Time Slot:</td>
              <td style="padding: 6px 0; color: #0056b3; font-weight: bold;">${timeslot}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Clinic Address:</td>
              <td style="padding: 6px 0;">${doctorProfile.clinicAddress}</td>
            </tr>
          </table>
        </div>

        <!-- HOSPITAL TIMINGS & INSTRUCTIONS -->
        <div style="border-top: 1px dashed #ccc; padding-top: 15px; margin-top: 20px; text-align: center;">
          <p style="font-size: 13px; color: #d9534f; font-weight: bold; margin-bottom: 5px;">
            ⚠️ Please reach 10 minutes prior to your allocated time slot.
          </p>
          <p style="font-size: 12px; color: #666666; margin: 5px 0;">
            <strong>Hospital Working Hours:</strong> ${hospital.timings}
          </p>
        </div>

        <!-- FOOTER -->
        <div style="margin-top: 30px; text-align: center; font-size: 11px; color: #999999;">
          <p>This is an automated email from ${hospital.name}. Please do not reply directly to this message.</p>
        </div>
      </div>
    `;

    await sendEmail({
      email: req.user.email,
      subject: `Appointment Confirmation - ${hospital.name}`,
      html: emailContent,
    });

    res.status(201).json({
      success: true,
      message:
        "Appointment booked successfully! Confirmation email sent to your email.",
      data: appointment,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message:
          "This time slot is already booked for this doctor on the selected date.",
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Appointments for Logged-in User (Patient or Doctor)
// @route   GET /api/appointments/my-appointments
// @access  Private
const getMyAppointments = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === "patient") {
      filter.patient = req.user._id;
    } else if (req.user.role === "doctor") {
      filter.doctor = req.user._id;
    }

    const appointments = await Appointment.find(filter)
      .populate("patient", "name email phone")
      .populate("doctor", "name email phone")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Appointment Status
// @route   PUT /api/appointments/:id/status
// @access  Private (Doctor, Patient, Admin)


const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const isDoctor = appointment.doctor.toString() === req.user._id.toString();
    const isPatient =
      appointment.patient.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isDoctor && !isPatient && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to modify this appointment" });
    }

    if (isPatient && status !== "cancelled") {
      return res
        .status(400)
        .json({ message: "Patients can only cancel appointments" });
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({
      success: true,
      message: `Appointment status updated to ${status}`,
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  updateAppointmentStatus,
};
