const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  registerUser,
  loginUser,
  verifyEmail,
  updateUserDetails,
  forgotPassword,
  verifyOtp,
  resetPassword
} = require("../../controllers/auth-controller/index");
const authenticateMiddleware = require("../../middleware/auth-middleware");
const User = require("../../models/User"); // Import User model
const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: { success: false, message: "Too many login attempts from this IP, please try again after 15 minutes" },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const commonAuthLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // Limit each IP to 30 requests per windowMs
  message: { success: false, message: "Too many requests from this IP, please try again after an hour" },
});

router.post("/register", commonAuthLimiter, registerUser);
router.post("/login", loginLimiter, loginUser);
router.get("/verify-email", verifyEmail);
router.post("/forgot-password", commonAuthLimiter, forgotPassword);
router.post("/verify-otp", commonAuthLimiter, verifyOtp);
router.post("/reset-password", commonAuthLimiter, resetPassword);
router.put("/update", authenticateMiddleware, updateUserDetails);
router.get("/check-auth", authenticateMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id); // Fetch fresh user data

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Authenticated user!",
      data: {
        user: {
          _id: user._id,
          fName: user.fName,
          email: user.email,
          role: user.role,
          phone: user.phone,
          image: user.image,
          address: user.address,
          qualification: user.qualification
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching user data" });
  }
});

module.exports = router;
