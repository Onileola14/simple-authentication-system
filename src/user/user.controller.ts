const User = require("../models/User");
const { createPermission } = require("../shared/checkPermission");
const { StatusCodes } = require("http-status-codes");
const {
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../errors");

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: { $ne: "admin" } }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};
const getSingleUser = async (req, res) => {
  const { id: userId } = req.params;
  createPermission(req.user, userId);
  const user = await User.findOne({ _id: userId }).select("-password");
  if (!user) {
    throw new NotFoundError(`No user with id : ${userId}`);
  }
  res.status(StatusCodes.OK).json({ user });
};

const deleteUser = async (req, res) => {
  const { id: userId } = req.params;
  createPermission(req.user, userId);
  const user = await User.findOneAndDelete({ _id: userId });
  if (!user) {
    throw new NotFoundError(`No user with id : ${userId}`);
  }
  res.status(StatusCodes.OK).json({ msg: "user deleted successfully" });
};

const updateUser = async (req, res) => {
  const { id: userId } = req.params;
  createPermission(req.user, userId);

  const { name, email } = req.body;
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (email !== undefined) updates.email = email;

  const user = await User.findOneAndUpdate({ _id: userId }, updates, {
    new: true,
    runValidators: true,
  }).select("-password");
  if (!user) {
    throw new NotFoundError(`No user with id : ${userId}`);
  }

  res.status(StatusCodes.OK).json({ user });
};

const updateUserPassword = async (req, res) => {
  const { id: userId } = req.params;
  createPermission(req.user, userId);

  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new BadRequestError("please provide old and new password");
  }

  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new NotFoundError(`No user with id : ${userId}`);
  }

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("invalid credentials");
  }

  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: "password updated successfully" });
};

module.exports = { getAllUsers, getSingleUser, deleteUser, updateUser, updateUserPassword };
