import User from "../models/User";
import { StatusCodes } from "http-status-codes";
import { Request, Response} from "express";
const {
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../errors");
const { createJWT, attachCookiesToResponse } = require("../shared/jwt");
const createTokenUser = require("../shared/createTokenUser");

export const register = async (req: Request, res: Response) => {
  const { name, password, email, role } = req.body;
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new BadRequestError("user already exist , proceed to login");
  }

  const isFirstAccount = (await User.countDocuments({})) === 0;
  const userRole = isFirstAccount ? "admin" : "user";
  req.body.role = userRole;

  const user = await User.create({ name, password, email, role: userRole });
  const tokenUser = createTokenUser(user);
  const token = createJWT({ payload: tokenUser });
  attachCookiesToResponse(res, tokenUser);
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("please provide email and password");
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new UnauthenticatedError("invalid credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("invalid credentials");
  }

  const tokenUser = createTokenUser(user);
  const token = createJWT({ payload: tokenUser });
  attachCookiesToResponse(res, tokenUser);
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

export const logout = async (req: Request, res: Response) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};
