const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");

const { createToken, createCookie } = require("../utils/jwt");

const checkPermissions = require("../utils/checkPermissions");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select(
      "-password -__v  -failedLoginAttempts -lockUntil -isLocked"
    );
    res
      .status(StatusCodes.OK)
      .json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });

    const { _id, name, email, role } = user;
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: `No user with id : ${id}` });
    }
    //check if the user is the same as the logged in user
    checkPermissions(req.user, user._id, res);

    res
      .status(StatusCodes.OK)
      .json({ success: true, user: { _id, name, email, role } });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    const token = createToken(user);
    createCookie(res, token);

    res.status(StatusCodes.OK).json({ success: true, user });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message });
  }
};
const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "User not found" });
    }

    const isPasswordMatch = await user.comparePassword(oldPassword);

    if (!isPasswordMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, msg: "Invalid credentials" });
    }

    user.password = newPassword;
    await user.save();

    res.status(StatusCodes.OK).json({ success: true, msg: "Password updated" });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message });
  }
};

const showActiveUser = async (req, res) => {
  try {
    const { userId, name, role } = req.user;
    res.status(StatusCodes.OK).json({ success: true, userId, name, role });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message });
  }
};

const deleteActiveUser = async (req, res) => {
  try {
    const { password } = req.body;

    const user = await User.findById(req.user.userId);

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, msg: "Invalid credentials" });
    }
    await User.findByIdAndDelete(req.user.userId);
    res
      .status(StatusCodes.OK)
      .json({ success: true, msg: "User deleted Successfully" });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message });
  }
};
module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  updatePassword,
  showActiveUser,
  deleteActiveUser,
};
