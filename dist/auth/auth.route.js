"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express = require("express");
const { authLimiter } = require("../middlewares/rateLimiter");
const { validateRegister, validateLogin } = require("../middlewares/validators");
exports.router = express.Router();
const { register, login, logout } = require("./auth.controller");
exports.router.route("/register").post(authLimiter, validateRegister, register);
exports.router.route("/login").post(authLimiter, validateLogin, login);
exports.router.route("/logout").get(logout);
//# sourceMappingURL=auth.route.js.map