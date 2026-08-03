const express = require("express");
const {authLimiter} = require("../middlewares/rateLimiter");
const router = express.Router();
const { register, login, logout } = require("../controllers/auth");

router.route("/register").post(authLimiter, register);
router.route("/login").post(authLimiter, login);
router.route("/logout").get(logout);

module.exports = router;
