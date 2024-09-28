const { body } = require("express-validator");

const registerValidation = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/\d/)
    .withMessage("Password must contain a number"),
  body("role").optional().isIn(["user", "admin"]).withMessage("Invalid role"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

const forgotPasswordValidation = [
  body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
];

const resetPasswordValidation = [
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/\d/)
    .withMessage("Password must contain a number"),
];

module.exports = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
};
