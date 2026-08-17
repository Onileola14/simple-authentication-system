"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLimiter = void 0;
const express_rate_limit_1 = require("express-rate-limit");
exports.authLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 requests per IP per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        msg: "Too many attempts from this IP, please try again after 15 minutes",
    },
});
//# sourceMappingURL=rateLimiter.js.map