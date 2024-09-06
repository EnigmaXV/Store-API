const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const { protect } = require("../middlewares/authentication");

router.post("/signup", signup);
router.post("/login", login);
router.delete("/logout", protect, logout);
router.route("/verify-email").post(verifyEmail);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);

module.exports = router;
