import User from "../models/User";
import { createPermission } from "../shared/checkPermission";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { UnauthenticatedError, NotFoundError, BadRequestError } from "../errors";

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find({ role: { $ne: "admin" } }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

export const getSingleUser = async (req: Request, res: Response) => {
  const { id: userId } = req.params as { id: string };
  createPermission(req.user!, userId);
  const user = await User.findOne({ _id: userId }).select("-password");
  if (!user) throw new NotFoundError(`No user with id : ${userId}`);
  res.status(StatusCodes.OK).json({ user });
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id: userId } = req.params as { id: string };
  createPermission(req.user!, userId); // was createPermission(req.user, "userId") — literal string, not the variable
  const user = await User.findOneAndDelete({ _id: userId });
  if (!user) throw new NotFoundError(`No user with id : ${userId}`);
  res.status(StatusCodes.OK).json({ msg: "user deleted successfully" });
};

export const updateUser = async (req: Request, res: Response) => {
  const { id: userId } = req.params as { id: string };
  createPermission(req.user!, userId);

  const { name, email } = req.body;
  const updates: { name?: string; email?: string } = {};
  if (name !== undefined) updates.name = name;
  if (email !== undefined) updates.email = email;

  const user = await User.findOneAndUpdate({ _id: userId }, updates, {
    new: true,
    runValidators: true,
  }).select("-password");
  if (!user) throw new NotFoundError(`No user with id : ${userId}`);

  res.status(StatusCodes.OK).json({ user });
};

export const updateUserPassword = async (req: Request, res: Response) => {
  const { id: userId } = req.params as { id: string };
  createPermission(req.user!, userId);

  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new BadRequestError("please provide old and new password");
  }

  const user = await User.findOne({ _id: userId }).select("+password"); // was missing — password has select:false in the schema
  if (!user) throw new NotFoundError(`No user with id : ${userId}`);

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("invalid credentials");
  }

  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: "password updated successfully" });
};