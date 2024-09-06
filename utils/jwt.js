const jwt = require("jsonwebtoken");

const createAccessToken = (user) => {
  const payload = { userId: user._id, name: user.name, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET);
};

const createRefreshToken = (user) => {
  const payload = {
    userId: user._id,
    name: user.name,
    role: user.role,
  };
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET);
};

const createAccessCookie = (res, accessToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    secure: process.env.NODE_ENV === "production" ? true : false,
    signed: true,
  });
};

const createRefreshCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    secure: process.env.NODE_ENV === "production" ? true : false,
    signed: true,
  });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

const clearAccessCookie = (res, accessToken) => {
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production" ? true : false,
    signed: true,
  });
};

const clearRefreshCookie = (res) => {
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production" ? true : false,
    signed: true,
  });
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  createAccessCookie,
  createRefreshCookie,
  verifyAccessToken,
  verifyRefreshToken,
  clearAccessCookie,
  clearRefreshCookie,
};
