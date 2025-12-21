const express = require("express");
const {
  registerUser,
  loginUser,
  verifyEmail,
  updateUserDetails
} = require("../../controllers/auth-controller/index");
const authenticateMiddleware = require("../../middleware/auth-middleware");
const User = require("../../models/User"); // Import User model
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify-email", verifyEmail);
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
