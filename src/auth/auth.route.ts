import express from "express";
const { authLimiter } = require("../middlewares/rateLimiter");
const {
  validateRegister,
  validateLogin,
} = require("../middlewares/validators");
export const router: express.Router = express.Router();
import { register, login, logout } from "./auth.controller";

router.route("/register").post(authLimiter, validateRegister, register);
router.route("/login").post(authLimiter, validateLogin, login);
router.route("/logout").get(logout);
