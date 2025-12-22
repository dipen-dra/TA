const User = require("../../models/User");
const PasswordResetToken = require("../../models/PasswordResetToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

// Email transporter setup - TEMPORARILY DISABLED
// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "prajwalneupane385@gmail.com",
    pass: "qlziyuruohzbzxou",
  },
});

// Register User with Email Verification
const registerUser = async (req, res) => {
  try {
    let { fName, email, password, role, phone, image, address, qualification } = req.body;

    if (!role) role = "user";

    const existingUser = await User.findOne({ $or: [{ email }, { fName }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User name or email already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      fName,
      email,
      role,
      password: hashPassword,
      phone,
      phone,
      image,
      address,
      qualification,
      verified: false,
      verificationToken,
    });

    await newUser.save();

    // Send verification email - TEMPORARILY DISABLED
    // const verificationLink = `http://localhost:5000/auth/verify-email?token=${verificationToken}`;

    // const mailOptions = {
    //   from: process.env.EMAIL_USER,
    //   to: email,
    //   subject: "Verify Your Email",
    //   html: `<p>Click the link below to verify your email:</p>
    //          <a href="${verificationLink}">Verify Email</a>`,
    // };

    // transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: "User registered successfully! (Email verification temporarily disabled)",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error", error });
  }
};

// Verify Email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    user.verified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ success: true, message: "Email verified successfully! You can now log in." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error", error });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("email:", email)
  console.log("pw:", password)

  const checkUser = await User.findOne({ email });

  if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  // Check if the user is verified before issuing a token - TEMPORARILY DISABLED
  // if (!checkUser.verified) {
  //   return res.status(403).json({
  //     success: false,
  //     message: "Your account is not verified. Please check your email.",
  //   });
  // }

  const accessToken = jwt.sign(
    {
      _id: checkUser._id,
      fName: checkUser.fName,
      email: checkUser.email,
      role: checkUser.role,
      phone: checkUser.phone,
      phone: checkUser.phone,
      image: checkUser.image,
      address: checkUser.address,
      qualification: checkUser.qualification,
    },
    "JWT_SECRET",
    { expiresIn: "120m" }
  );

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: {
      accessToken,
      user: {
        _id: checkUser._id,
        fName: checkUser.fName,
        email: checkUser.email,
        role: checkUser.role,
        phone: checkUser.phone,
        phone: checkUser.phone,
        image: checkUser.image,
        address: checkUser.address,
        qualification: checkUser.qualification,
      },
    },
  });
};


const updateUserDetails = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const userId = req.user._id; // Extracted from authentication
    const { fName, phone, image, password, role, currentPassword, address, qualification } = req.body;

    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let updateFields = {};
    if (fName) updateFields.fName = fName;
    if (phone) updateFields.phone = phone;
    if (image) updateFields.image = image;
    if (address) updateFields.address = address;
    if (qualification) updateFields.qualification = qualification;

    // Check if password change is requested
    if (password) {
      // Ensure current password is provided for password change
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password is required to set a new password",
        });
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: "Incorrect current password" });
      }

      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    // Only admins can update roles
    if (role && req.user.role === "admin") {
      updateFields.role = role;
    }

    // Update user details
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "User details updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Internal server error", error });
  }
};







const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found with this email" });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save to DB (upsert if exists)
    // Set expiration to 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Delete existing token if any
    await PasswordResetToken.findOneAndDelete({ email });

    await new PasswordResetToken({
      email,
      token: otp, // For better security, we should hash this, but for MVP plain text is okay if TLS is used
      expiresAt
    }).save();

    // Send Email
    const mailOptions = {
      from: "prajwalneupane385@gmail.com",
      to: email,
      subject: "Password Reset OTP - Tayari Adda",
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #2563EB; text-align: center;">Password Reset Request</h2>
                    <p style="font-size: 16px; color: #333;">Hello ${user.fName},</p>
                    <p style="font-size: 16px; color: #333;">You requested to reset your password. Use the OTP below to proceed:</p>
                    <div style="background-color: #F3F4F6; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1F2937;">${otp}</span>
                    </div>
                    <p style="font-size: 14px; color: #666;">This OTP is valid for 10 minutes.</p>
                    <p style="font-size: 14px; color: #666;">If you didn't request this, please ignore this email.</p>
                </div>
            `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Failed to send email" });
      } else {
        return res.status(200).json({ success: true, message: "OTP sent to your email" });
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = await PasswordResetToken.findOne({ email });

    if (!record) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    const isValid = record.token === otp;
    const isExpired = record.expiresAt < new Date();

    if (!isValid || isExpired) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    return res.status(200).json({ success: true, message: "OTP verified successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Verify OTP again
    const record = await PasswordResetToken.findOne({ email });
    if (!record || record.token !== otp || record.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP session" });
    }

    // Hash new password
    const hashPassword = await bcrypt.hash(newPassword, 10);

    // Update User
    await User.findOneAndUpdate({ email }, { password: hashPassword });

    // Delete Token
    await PasswordResetToken.deleteOne({ email });

    return res.status(200).json({ success: true, message: "Password has been reset successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};


module.exports = { registerUser, verifyEmail, loginUser, updateUserDetails, forgotPassword, verifyOtp, resetPassword };
