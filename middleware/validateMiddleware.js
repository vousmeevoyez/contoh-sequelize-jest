const { validationResult } = require("express-validator");

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    res.status(400).json({
      status: 400,
      warning: "validation_error",
      returnCode: 400,
      message: "Validation failed",
      count: errors.array().length,
      items: errors.array(),
    });
  };
};

module.exports = {
  validate,
};
