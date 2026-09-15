const mongoose = require("mongoose");
const AppointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Appointment must be associated with a patient"],
      index: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Appointment must be associated with a doctor"],
      index: true,
    },
    date: {
      type: Date,
      required: [true, "Appointment date is required"],
    },
    timeslot: {
      type: String,
      required: [true, "Appointment timeslot is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "approved", "cancelled", "completed"],
        message: "{VALUE} is not a valid status",
      },
      default: "pending",
    },
    problemDescription: {
      type: String,
      maxlength: [500, "Problem description must be less than 500 characters"],
      trim: true,
    },
  },
  { timestamps: true },
);
AppointmentSchema.index({ doctor: 1, date: 1, timeslot: 1 }, { unique: true });

const Appointment =
  mongoose.models.Appointment ||
  mongoose.model("Appointment", AppointmentSchema);

module.exports = Appointment;
