"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdatePassword = exports.validateUpdateUser = exports.validateLogin = exports.validateRegister = void 0;
const express_validator_1 = require("express-validator");
const errors_1 = require("../errors");
const withValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const messages = errors.array().map((err) => err.msg);
        throw new errors_1.BadRequestError(messages.join(", "));
    }
    next();
};
exports.validateRegister = [
    (0, express_validator_1.body)("name").trim().notEmpty().withMessage("name is required").isLength({ min: 3 }).withMessage("name must be at least 3 characters"),
    (0, express_validator_1.body)("email").trim().notEmpty().withMessage("email is required").isEmail().withMessage("please provide a valid email").normalizeEmail(),
    (0, express_validator_1.body)("password").notEmpty().withMessage("password is required").isLength({ min: 6 }).withMessage("password must be at least 6 characters"),
    withValidationErrors,
];
exports.validateLogin = [
    (0, express_validator_1.body)("email").trim().notEmpty().withMessage("email is required").isEmail().withMessage("please provide a valid email").normalizeEmail(),
    (0, express_validator_1.body)("password").notEmpty().withMessage("password is required"),
    withValidationErrors,
];
exports.validateUpdateUser = [
    (0, express_validator_1.body)("name").optional().trim().isLength({ min: 3 }).withMessage("name must be at least 3 characters"),
    (0, express_validator_1.body)("email").optional().trim().isEmail().withMessage("please provide a valid email").normalizeEmail(),
    withValidationErrors,
];
exports.validateUpdatePassword = [
    (0, express_validator_1.body)("oldPassword").notEmpty().withMessage("old password is required"),
    (0, express_validator_1.body)("newPassword").notEmpty().withMessage("new password is required").isLength({ min: 6 }).withMessage("new password must be at least 6 characters"),
    withValidationErrors,
];
//# sourceMappingURL=validators.js.map