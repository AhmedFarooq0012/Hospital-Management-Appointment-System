const DoctorProfile = require("../models/DoctorProfile.model");
const User = require("../models/User.model");

// @desc    Create or Update Doctor Profile
// @route   POST /api/doctors/profile
// @access  Private (Doctor & Admin)
const createOrUpdateProfile = async (req, res) => {
  try {
    const {
      specialization,
      experienceYears,
      fees,
      clinicAddress,
      availableDays,
      timeSlots,
      userId, // Optional: Admin can pass target doctor ID
    } = req.body;

    let targetUserId = req.user._id;

    // Admin target switch logic
    if (req.user.role === "admin" && userId) {
      targetUserId = userId;
    }

    // Verify user role is doctor
    const user = await User.findById(targetUserId);
    if (!user || user.role !== "doctor") {
      return res
        .status(400)
        .json({ message: "Target user must have 'doctor' role" });
    }

    const profileData = {
      user: targetUserId,
      specialization,
      experienceYears,
      fees,
      clinicAddress,
      availableDays,
      timeSlots,
    };

    let profile = await DoctorProfile.findOne({ user: targetUserId });

    if (profile) {
      // Update existing profile
      profile = await DoctorProfile.findOneAndUpdate(
        { user: targetUserId },
        { $set: profileData },
        { new: true, runValidators: true },
      );
      return res.status(200).json({
        success: true,
        message: "Doctor profile updated successfully",
        data: profile,
      });
    }

    // Create new profile
    profile = await DoctorProfile.create(profileData);
    res.status(201).json({
      success: true,
      message: "Doctor profile created successfully",
      data: profile,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Logged-in Doctor Profile
// @route   GET /api/doctors/me
// @access  Private (Doctor)
const getMyProfile = async (req, res) => {
  try {
    const profile = await DoctorProfile.findOne({
      user: req.user._id,
    }).populate("user", "name email phone");

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get All Approved Doctors (Public / Patient view)
// @route   GET /api/doctors
// @access  Public
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await DoctorProfile.find({ isApproved: true }).populate(
      "user",
      "name email phone",
    );

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrUpdateProfile, getMyProfile, getAllDoctors };
