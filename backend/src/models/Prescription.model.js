const mongoose = require("mongoose");

const PrescriptionSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    medicines: [
      {
        name: { type: String, required: true },
        dosage: { type: String, required: true }, // e.g., "1-0-1" or "500mg"
        duration: { type: String, required: true }, // e.g., "5 days"
        instructions: { type: String }, // e.g., "After meal"
      },
    ],
    diagnosis: { type: String },
    notes: { type: String },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.Prescription ||
  mongoose.model("Prescription", PrescriptionSchema);
