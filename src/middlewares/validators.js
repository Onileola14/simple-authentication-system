const { body, validationResult } = require("express-validator");
const { BadRequestError } = require("../errors");

const withValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((err) => err.msg);
    throw new BadRequestError(messages.join(", "));
  }
  next();
};

const validateRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 3 })
    .withMessage("name must be at least 3 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("please provide a valid email")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),
  withValidationErrors,
];

const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("please provide a valid email")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("password is required"),
  withValidationErrors,
];

const validateUpdateUser = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("name must be at least 3 characters"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("please provide a valid email")
    .normalizeEmail(),
  withValidationErrors,
];

const validateUpdatePassword = [
  body("oldPassword").notEmpty().withMessage("old password is required"),
  body("newPassword")
    .notEmpty()
    .withMessage("new password is required")
    .isLength({ min: 6 })
    .withMessage("new password must be at least 6 characters"),
  withValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateUpdateUser,
  validateUpdatePassword,
};
