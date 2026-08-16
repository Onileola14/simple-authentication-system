import { isTokenValid } from "../shared/jwt";
import type { Request, Response, NextFunction } from "express";
const { UnauthenticatedError, UnauthorizedError } = require("../errors");

const authenticateUser = async (req:Request, res:Response, next:NextFunction) => {
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

const authorizePermissions = (...roles : string[]) => {
  return  (req:Request, res:Response, next:NextFunction) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError("Unauthorized to access this route");
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermissions };
