const User = require("../models/User.model");
const { hashPassword, comparepassword } = require("../utils/hashPassword");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail"); // for sending email
// @desc    Register a new user
// @route   POST /api/auth/register
// const registerUser = async (req, res) => {
//   console.log("testing in progress");
//   try {
//     const { name, email, password, role, phone } = req.body;

//     // Check if user exists
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res
//         .status(400)
//         .json({ message: "User already exists with this email" });
//     }
//     // otp sending
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

//     // Hash password using utility
//     const hashedPassword = await hashPassword(password);

//     // Create User
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: role || "patient",
//       phone,
//     });

//     // Generate JWT Token
//     const token = generateToken(user._id, user.role);

//     res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       data: {
//         User: user,
//         token,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if verified user exists
    let user = await User.findOne({ email });
    if (user && user.isVerified) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // 6-digit OTP & 5 Minute Expiry (5 * 60 * 1000 ms)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    const hashedPassword = await hashPassword(password);

    if (user && !user.isVerified) {
      // Re-register unverified user
      user.name = name;
      user.password = hashedPassword;
      user.role = role || "patient";
      user.phone = phone || "";
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
    } else {
      // Create new unverified user
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || "patient",
        phone,
        otp,
        otpExpires,
      });
    }

    // Send Email
    const message = `Your OTP for registration on Doctor Appointment System is: ${otp}\n\nThis OTP is valid for 5 minutes only.`;

    await sendEmail({
      email: user.email,
      subject: "Account Verification OTP",
      message,
    });

    res.status(200).json({
      success: true,
      message:
        "OTP sent to your email. Please verify to complete registration.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Step 2: Verify OTP & Activate Account
// @route   POST /api/auth/verify-otp
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Please provide email and OTP" });
    }

    // Find user with hidden fields
    const user = await User.findOne({ email }).select("+otp +otpExpires");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    // 1. Match OTP

    if (String(user.otp).trim() !== String(otp).trim()) {
      return res.status(400).json({ message: "Invalid OTP code" });
    }

    // 2. Check 5 Minute Expiry
    if (new Date() > user.otpExpires) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please register again." });
    }

    // Account verified: Mark true & remove OTP fields
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate JWT Token
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: "Account verified successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password presence
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide an email and password" });
    }

    // Explicitly select password since it has 'select: false' in UserSchema
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare entered password with hashed password in DB
    const isMatch = await comparepassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, verifyOTP };
