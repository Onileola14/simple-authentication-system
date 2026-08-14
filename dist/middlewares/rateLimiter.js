"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rateLimit = require("express-rate-limit");
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 requests per IP per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        msg: "Too many attempts from this IP, please try again after 15 minutes",
    },
});
module.exports = { authLimiter };
//# sourceMappingURL=rateLimiter.js.map