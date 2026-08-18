import express from "express";
import { authLimiter } from "../middlewares/rateLimiter";
import { validateRegister, validateLogin } from "../middlewares/validators";
import { register, login, logout } from "./auth.controller";

const router = express.Router();

router.route("/register").post(authLimiter, validateRegister, register);
router.route("/login").post(authLimiter, validateLogin, login);
router.route("/logout").get(logout);

export default router;