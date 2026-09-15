const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1. Transporter configuration
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2. Email details setup
  const mailOptions = {
    from: `Doctor Appointment System <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3. Email send karein
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
