"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizePermissions = exports.authenticateUser = void 0;
const jwt_1 = require("../shared/jwt");
const errors_1 = require("../errors");
const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token;
    try {
        if (!token) {
            throw new errors_1.UnauthenticatedError("Authentication invalid");
        }
        const payload = (0, jwt_1.isTokenValid)(token);
        req.user = {
            userId: payload.userId,
            name: payload.name,
            email: payload.email,
            role: payload.role,
        };
        next();
    }
    catch (error) {
        throw new errors_1.UnauthenticatedError("Authentication invalid");
    }
};
exports.authenticateUser = authenticateUser;
const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            throw new errors_1.UnauthorizedError("Unauthorized to access this route");
        }
        next();
    };
};
exports.authorizePermissions = authorizePermissions;
//# sourceMappingURL=authenticateuser.middleware.js.map