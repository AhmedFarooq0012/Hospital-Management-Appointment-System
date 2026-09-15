const mongoose = require("mongoose");

const HospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Hospital name is required"],
      trim: true,
      default: "CITY HOSPITAL",
    },
    address: {
      type: String,
      required: [true, "Hospital address is required"],
      trim: true,
      default: "123 Healthcare Ave, Medical District",
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      default: "+123-456-7890",
    },
    emergencyPhone: {
      type: String,
      required: [true, "Emergency contact number is required"],
      trim: true,
      default: "+123-999-9111",
    },
    email: {
      type: String,
      required: [true, "Hospital email is required"],
      trim: true,
      lowercase: true,
      default: "info@hospital.com",
    },
    timings: {
      type: String,
      required: [true, "Hospital timing is required"],
      default: "Mon - Sat: 08:00 AM - 10:00 PM | Sun: Emergency Only",
    },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.Hospital || mongoose.model("Hospital", HospitalSchema);
