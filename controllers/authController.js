const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");
const { createToken, createCookie, verifyToken } = require("../utils/jwt");
const {
  resetFailedAttempts,
  handleFailedLoginAttempt,
  checkIfLocked,
} = require("../utils/userLock");

const TOTAL_ATTEMPTS = 5;

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

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    const token = createToken(user);
    createCookie(res, token);

    res.status(StatusCodes.CREATED).json({
      success: "true",
      user: {
        name,
        email,
        role,
      },
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

    const token = createToken(user);
    createCookie(res, token);

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
    res.cookie("token", "logout", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(StatusCodes.OK).json({ msg: "User logged out" });
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

module.exports = {
  signup,
  login,
  logout,
};
