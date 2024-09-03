const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");
const { verifyToken } = require("../utils/jwt");

const protect = async (req, res, next) => {
  const { token } = req.signedCookies;

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "You need to be logged in" });
  }

  try {
    const decoded = verifyToken(token);

    if (!decoded) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "You need to be logged in" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "You do not have permission to perform this action" });
    }
    next();
  };
};

module.exports = { protect, restrictTo };
