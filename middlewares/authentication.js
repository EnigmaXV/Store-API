const { StatusCodes } = require("http-status-codes");
const {
  verifyAccessToken,
  verifyRefreshToken,
  createAccessToken,
  createAccessCookie,
} = require("../utils/jwt");

const protect = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;
  if (!accessToken && !refreshToken) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "You need to be logged in" });
  }

  if (accessToken) {
    try {
      const decodedAccessToken = verifyAccessToken(accessToken);
      if (!decodedAccessToken) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: "You need to be logged in" });
      }
      req.user = decodedAccessToken;
      return next();
    } catch (error) {
      if (
        error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError"
      ) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: "You need to be logged in" });
      }
    }
  }

  if (refreshToken) {
    try {
      const decodedRefreshToken = verifyRefreshToken(refreshToken);
      if (!decodedRefreshToken) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: "You need to be logged in" });
      }

      const newAccessTokenPayload = {
        userId: decodedRefreshToken.userId,
        name: decodedRefreshToken.name,
        role: decodedRefreshToken.role,
      };
      const newAccessToken = createAccessToken(newAccessTokenPayload);
      createAccessCookie(res, newAccessToken);
      req.user = decodedRefreshToken;
      return next();
    } catch (err) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "You need to be logged in" });
    }
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
