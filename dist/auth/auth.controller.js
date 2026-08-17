"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const http_status_codes_1 = require("http-status-codes");
const { UnauthenticatedError, NotFoundError, BadRequestError, UnauthorizedError, } = require("../errors");
const jwt_1 = require("../shared/jwt");
const createTokenUser_1 = require("../shared/createTokenUser");
const register = async (req, res) => {
    const { name, password, email, role } = req.body;
    const isUserExist = await User_1.default.findOne({ email });
    if (isUserExist) {
        throw new BadRequestError("user already exist , proceed to login");
    }
    const isFirstAccount = (await User_1.default.countDocuments({})) === 0;
    const userRole = isFirstAccount ? "admin" : "user";
    req.body.role = userRole;
    const user = await User_1.default.create({ name, password, email, role: userRole });
    const tokenUser = (0, createTokenUser_1.createTokenUser)(user);
    const token = (0, jwt_1.createJWT)({ payload: tokenUser });
    (0, jwt_1.attachCookiesToResponse)(res, tokenUser);
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ user: tokenUser });
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError("please provide email and password");
    }
    const user = await User_1.default.findOne({ email }).select("+password");
    if (!user) {
        throw new UnauthenticatedError("invalid credentials");
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError("invalid credentials");
    }
    const tokenUser = (0, createTokenUser_1.createTokenUser)(user);
    const token = (0, jwt_1.createJWT)({ payload: tokenUser });
    (0, jwt_1.attachCookiesToResponse)(res, tokenUser);
    res.status(http_status_codes_1.StatusCodes.OK).json({ user: tokenUser });
};
exports.login = login;
const logout = async (req, res) => {
    res.cookie("token", "logout", {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "user logged out!" });
};
exports.logout = logout;
//# sourceMappingURL=auth.controller.js.map