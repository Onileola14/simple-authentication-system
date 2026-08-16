"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const { authLimiter } = require("../middlewares/rateLimiter");
const { validateRegister, validateLogin, } = require("../middlewares/validators");
exports.router = express_1.default.Router();
const auth_controller_1 = require("./auth.controller");
exports.router.route("/register").post(authLimiter, validateRegister, auth_controller_1.register);
exports.router.route("/login").post(authLimiter, validateLogin, auth_controller_1.login);
exports.router.route("/logout").get(auth_controller_1.logout);
//# sourceMappingURL=auth.route.js.map