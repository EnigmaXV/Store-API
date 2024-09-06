const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");
const {
  createAccessToken,
  createRefreshToken,
  createAccessCookie,
  createRefreshCookie,
  clearAccessCookie,
  clearRefreshCookie,
} = require("../utils/jwt");
const {
  resetFailedAttempts,
  handleFailedLoginAttempt,
  checkIfLocked,
} = require("../utils/userLock");
const sendVerificationEmail = require("../utils/sendVerificationEmail");
const sendResetPasswordEmail = require("../utils/sendResetPasswordEmail");
const crypto = require("crypto");
const Token = require("../models/tokenModel");

const TOTAL_ATTEMPTS = 5;

const origin = "http://localhost:3000";

const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !password || !name) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Please provide name, email and password" });
    }

    const emailAlreadyExists = await User.findOne({ email });

    if (emailAlreadyExists) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Email already exists please login" });
    }

    const token = crypto.randomBytes(40).toString("hex");

    const user = await User.create({
      name,
      email,
      password,
      role,
      verificationToken: token,
    });

    await sendVerificationEmail(name, email, token, origin);

    res.status(StatusCodes.CREATED).json({
      success: "true",
      msg: `User ${user.name} created successfully Please check your email to verify your account`,
    });
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { verificationToken, email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "User not found" });
    }

    if (verificationToken !== user.verificationToken) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationDate = new Date();

    await user.save();

    res.status(StatusCodes.OK).json({
      success: "true",
      msg: "Email verified successfully",
    });
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Please provide email and password" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Your email is not found try to sign up" });
    }

    if (checkIfLocked(user)) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "Account is locked. Try again later after 1 hour" });
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      await handleFailedLoginAttempt(user, TOTAL_ATTEMPTS);

      return res.status(StatusCodes.BAD_REQUEST).json({
        error: `Invalid credentials you have ${
          TOTAL_ATTEMPTS - user.failedLoginAttempts + 1
        } attempts left`,
      });
    }

    //reset failed attempts
    await resetFailedAttempts(user);

    if (!user.isVerified) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: "Please verify your email to login",
      });
    }

    let refreshToken = "";

    const existedToken = await Token.findOne({ user: user._id });

    if (existedToken) {
      refreshToken = existedToken.refreshToken;
    } else {
      refreshToken = createRefreshToken(user); // No need for 'const' here
      const userAgent = req.headers["user-agent"];
      const ip = req.ip;
      const userRefreshToken = {
        refreshToken,
        userAgent,
        ip,
        user: user._id,
      };
      await Token.create(userRefreshToken);
    }

    const accessToken = createAccessToken(user);

    createAccessCookie(res, accessToken);
    createRefreshCookie(res, refreshToken);

    res.status(StatusCodes.OK).json({
      success: "true",
      msg: `Welcome ${user.name}`,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

const logout = async (req, res) => {
  try {
    await Token.findOneAndDelete({ user: req.user.userId });
    clearAccessCookie(res);
    clearRefreshCookie(res);
    res.status(StatusCodes.OK).json({ success: "true", msg: "Logged out" });
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Please provide email" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "User not found" });
    }

    const token = crypto.randomBytes(40).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordTokenExpire = Date.now() + 3600000; // 1 hour

    await user.save();

    await sendResetPasswordEmail(user.name, user.email, token, origin);

    res.status(StatusCodes.OK).json({
      success: "true",
      msg: "Please check your email to reset your password",
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { resetPasswordToken, email, newPassword } = req.body;

    if (!resetPasswordToken || !email || !newPassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Please provide token, email and new password" });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "User not found" });
    }

    if (resetPasswordToken !== user.resetPasswordToken) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid token" });
    }

    if (Date.now() > user.resetPasswordTokenExpire) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Token expired" });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;

    await user.save();

    res.status(StatusCodes.OK).json({
      success: "true",
      msg: "Password reset successfully",
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};
module.exports = {
  signup,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
