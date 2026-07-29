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
  console.log(tokenUser);
  const token = createJWT({ payload: tokenUser });
  attachCookiesToResponse(res, tokenUser);
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

module.exports = { register };
