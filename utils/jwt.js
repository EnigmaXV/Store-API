const jwt = require("jsonwebtoken");

const createToken = (user) => {
  const payload = { userId: user._id, name: user.name, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    secure: process.env.NODE_ENV === "production" ? true : false,
    signed: true,
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { createToken, createCookie, verifyToken };
