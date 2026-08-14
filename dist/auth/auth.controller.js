"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const User_1 = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { UnauthenticatedError, NotFoundError, BadRequestError, UnauthorizedError, } = require("../errors");
const { createJWT, attachCookiesToResponse } = require("../shared/jwt");
const createTokenUser = require("../shared/createTokenUser");
const register = async (req, res) => {
    const { name, password, email, role } = req.body;
    const isUserExist = await User_1.User.findOne({ email });
    if (isUserExist) {
        throw new BadRequestError("user already exist , proceed to login");
    }
    const isFirstAccount = (await User_1.User.countDocuments({})) === 0;
    const userRole = isFirstAccount ? "admin" : "user";
    req.body.role = userRole;
    const user = await User_1.User.create({ name, password, email, role: userRole });
    const tokenUser = createTokenUser(user);
    const token = createJWT({ payload: tokenUser });
    attachCookiesToResponse(res, tokenUser);
    res.status(StatusCodes.CREATED).json({ user: tokenUser });
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError("please provide email and password");
    }
    const user = await User_1.User.findOne({ email });
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
exports.login = login;
const logout = async (req, res) => {
    res.cookie("token", "logout", {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};
exports.logout = logout;
//# sourceMappingURL=auth.controller.js.map