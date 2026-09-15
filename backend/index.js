const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const connectDB = require("./src/config/dbconfig");

// Clean imports without spelling/dot mistakes
const authRoutes = require("./src/routes/authRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const doctorRoutes = require("./src/routes/doctorRoutes");
const appointRoutes = require("./src/routes/appointment.Routes");
const prescriptionRoutes = require("./src/routes/prescriptionRoutes");
const cors = require("cors");
// const appointmentRoutes = require("./src/routes/appointmentRoutes");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointRoutes);
app.use("/api/prescriptions", prescriptionRoutes);

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}
module.exports = app;
