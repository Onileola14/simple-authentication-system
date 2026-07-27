const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res) => {
  const { name, password, email, role } = req.body;
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    res.status(StatusCodes.NOT_ACCEPTABLE).json({ msg: "user already exist , proceed to login" });
  }
  const user = await User.create(req.body);

};
