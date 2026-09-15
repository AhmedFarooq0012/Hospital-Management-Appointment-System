const mongoose = require("mongoose");
const DoctorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Doctor profile must be associated with a user"],
      unique: true,
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      trim: true,
      index: true,
    },
    experienceYears: {
      type: Number,
      required: [true, "Experience years is required"],
      min: [0, "Experience years cannot be negative"],
    },
    fees: {
      type: Number,
      required: [true, "Consultation fees is required"],
      min: [0, "Fees cannot be negative"],
    },
    clinicAddress: {
      type: String,
      required: [true, "Clinic address is required"],
      trim: true,
    },
    availableDays: {
      type: [String],
      required: [true, "Available days are required"],
      default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    timeSlots: {
      type: [String],
      required: [true, "Time slots are required"],
      default: [],
      set: (slots) => [...new Set(slots)],// Ensure unique time slots
    },
    isApproved: {
      type: Boolean,
      default: true, // Admin approval status for production apps
    },
  },
  { timestamps: true },
);

    const DoctorProfile = mongoose.models.DoctorProfile || mongoose.model("DoctorProfile", DoctorProfileSchema);
    module.exports = DoctorProfile;