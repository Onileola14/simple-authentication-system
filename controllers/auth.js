const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { createJWT, attachCookiesToResponse } = require("../utils/jwt");
const createTokenUser = require("../utils/createTokenUser");

const register = async (req, res) => {
  const { name, password, email, role } = req.body;
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    res
      .status(StatusCodes.NOT_ACCEPTABLE)
      .json({ msg: "user already exist , proceed to login" });
  }

  const isFirstAccount = (await User.countDocuments({})) === 0;
  const userRole = isFirstAccount ? "admin" : role;
  req.body.role = userRole;

  const user = await User.create({ name, password, email, role: userRole });
  const tokenUser = createTokenUser(user);
  const token = createJWT({ payload: tokenUser });
  attachCookiesToResponse(res, tokenUser);
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please provide email and password" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.status(StatusCodes.UNAUTHORIZED).json({ msg: "invalid credentials" });
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    res.status(StatusCodes.UNAUTHORIZED).json({ msg: "invalid credentials" });
  }

  const tokenUser = createTokenUser(user);
  const token = createJWT({ payload: tokenUser });
  attachCookiesToResponse(res, tokenUser);
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

module.exports = { register, login };
