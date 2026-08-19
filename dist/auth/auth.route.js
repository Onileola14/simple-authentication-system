"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rateLimiter_1 = require("../middlewares/rateLimiter");
const validators_1 = require("../middlewares/validators");
const auth_controller_1 = require("./auth.controller");
const router = express_1.default.Router();
router.route("/register").post(rateLimiter_1.authLimiter, validators_1.validateRegister, auth_controller_1.register);
router.route("/login").post(rateLimiter_1.authLimiter, validators_1.validateLogin, auth_controller_1.login);
router.route("/logout").get(auth_controller_1.logout);
exports.default = router;
//# sourceMappingURL=auth.route.js.map