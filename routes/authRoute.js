const express = require("express");
const {authLimiter} = require("../middlewares/rateLimiter");
const { validateRegister, validateLogin } = require("../middlewares/validators");
const router = express.Router();
const { register, login, logout } = require("../controllers/auth");

router.route("/register").post(authLimiter, validateRegister, register);
router.route("/login").post(authLimiter, validateLogin, login);
router.route("/logout").get(logout);

module.exports = router;