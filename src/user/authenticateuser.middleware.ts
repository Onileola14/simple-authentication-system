const { isTokenValid } = require("../shared/jwt");
const { StatusCodes } = require("http-status-codes");
const { UnauthenticatedError, UnauthorizedError } = require("../errors");
const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  try {
    if (!token) {
      throw new UnauthenticatedError("Authentication invalid");
    }
    const payload = isTokenValid(token);
    req.user = {
      userId: payload.userId,
      name: payload.name,
      role: payload.role,
    };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError("Unauthorized to access this route");
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermissions };
