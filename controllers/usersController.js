const User = require("../models/userModel");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select(
      "-password -__v  -failedLoginAttempts -lockUntil -isLocked"
    );
    res.status(200).json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const getUser = async (req, res) => {
  res.send("Get a user");
};

const updateUser = async (req, res) => {
  res.send("Update a user");
};
const updatePassword = async (req, res) => {
  res.send("Update a user password");
};

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  updatePassword,
};
