const { isTokenValid } = require("../utils/jwt");
const { StatusCodes } = require("http-status-codes");
const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  try {
    if (!token) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Authentication invalid" });
    }
    const payload = isTokenValid(token);
    req.user = {
      userId: payload.userId,
      name: payload.name,
      role: payload.role,
    };
    next();
  } catch (error) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication invalid" });
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res
        .status(StatusCodes.FORBIDDEN)
        .json({ msg: "Unauthorized to access this route" });
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermissions };
