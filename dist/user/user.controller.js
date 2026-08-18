"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPassword = exports.updateUser = exports.deleteUser = exports.getSingleUser = exports.getAllUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const checkPermission_1 = require("../shared/checkPermission");
const http_status_codes_1 = require("http-status-codes");
const { UnauthenticatedError, NotFoundError, BadRequestError, UnauthorizedError, } = require("../errors");
const getAllUsers = async (req, res) => {
    const users = await User_1.default.find({ role: { $ne: "admin" } }).select("-password");
    res.status(http_status_codes_1.StatusCodes.OK).json({ users });
};
exports.getAllUsers = getAllUsers;
const getSingleUser = async (req, res) => {
    const { id: userId } = req.params;
    (0, checkPermission_1.createPermission)(req.user, userId);
    const user = await User_1.default.findOne({ _id: userId }).select("-password");
    if (!user) {
        throw new NotFoundError(`No user with id : ${userId}`);
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ user });
};
exports.getSingleUser = getSingleUser;
const deleteUser = async (req, res) => {
    const { id: userId } = req.params;
    (0, checkPermission_1.createPermission)(req.user, "userId");
    const user = await User_1.default.findOneAndDelete({ _id: userId });
    if (!user) {
        throw new NotFoundError(`No user with id : ${userId}`);
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "user deleted successfully" });
};
exports.deleteUser = deleteUser;
const updateUser = async (req, res) => {
    const { id: userId } = req.params;
    (0, checkPermission_1.createPermission)(req.user, userId);
    const { name, email } = req.body;
    const updates = {};
    if (name !== undefined)
        updates.name = name;
    if (email !== undefined)
        updates.email = email;
    const user = await User_1.default.findOneAndUpdate({ _id: userId }, updates, {
        new: true,
        runValidators: true,
    }).select("-password");
    if (!user) {
        throw new NotFoundError(`No user with id : ${userId}`);
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ user });
};
exports.updateUser = updateUser;
const updateUserPassword = async (req, res) => {
    const { id: userId } = req.params;
    (0, checkPermission_1.createPermission)(req.user, userId);
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new BadRequestError("please provide old and new password");
    }
    const user = await User_1.default.findOne({ _id: userId });
    if (!user) {
        throw new NotFoundError(`No user with id : ${userId}`);
    }
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError("invalid credentials");
    }
    user.password = newPassword;
    await user.save();
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "password updated successfully" });
};
exports.updateUserPassword = updateUserPassword;
//# sourceMappingURL=user.controller.js.map