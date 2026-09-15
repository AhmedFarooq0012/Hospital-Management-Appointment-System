const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "doctor-appointment-system",
      serverSelectionTimeoutMS: 5000,
    });
    console.log(
      `✅ MongoDB Connected: ${conn.connection.host} | DB: ${conn.connection.name}`,
    );
  } catch (error) {
    console.error(`❌ Initial Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};
//// Application-wide connection event listeners
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️  MongoDB connection lost. Attempting to reconnect...");
});

mongoose.connection.on("error",(error)=>{
    console.error(`❌ MongoDB connection error: ${error.message}`);
})
// for shutdown db connection gracefully
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🔒 MongoDB connection closed due to app termination");
  process.exit(0);
});
module.exports = connectDB;
