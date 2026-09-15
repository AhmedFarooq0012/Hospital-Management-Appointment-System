const User = require("../models/User.model");
const Hospital = require("../models/Hospital.model");

// @desc    Update user role by Admin
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin only)
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body; // Fixed: Destructured role from req.body

    if (!["admin", "doctor", "patient"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }, // Fixed: Capital V in runValidators
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: `User role updated to ${role} successfully`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// module.exports = { updateUserRole };

// @desc    Get or Update Hospital Profile
// @route   POST /api/admin/hospital
// @access  Private (Admin only)
const updateHospitalInfo = async (req, res) => {
  try {
    const { name, address, phone, emergencyPhone, email, timings } = req.body;

    let hospital = await Hospital.findOne();

    if (hospital) {
      hospital = await Hospital.findOneAndUpdate(
        {},
        { $set: { name, address, phone, emergencyPhone, email, timings } },
        { new: true, runValidators: true },
      );
    } else {
      hospital = await Hospital.create({
        name,
        address,
        phone,
        emergencyPhone,
        email,
        timings,
      });
    }

    res.status(200).json({
      success: true,
      message: "Hospital details updated successfully",
      data: hospital,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Hospital Info (Public View)
// @route   GET /api/admin/hospital
// @access  Public
const getHospitalInfo = async (req, res) => {
  try {
    let hospital = await Hospital.findOne();
    if (!hospital) {
      hospital = await Hospital.create({}); // Seed default if not exists
    }
    res.status(200).json({ success: true, data: hospital });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateHospitalInfo, getHospitalInfo, updateUserRole };
