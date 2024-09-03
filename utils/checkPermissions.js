const { StatusCodes } = require("http-status-codes");

const checkPermissions = (reqUser, userId, res) => {
  if (reqUser.role === "admin") return;

  if (reqUser.userId !== userId.toString()) {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      msg: "You are not authorized to perform this action",
    });
  }
};

module.exports = checkPermissions;
