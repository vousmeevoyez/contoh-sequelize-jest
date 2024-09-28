const multer = require("multer");

const uploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        status: 413,
        returnCode: -10000000001,
        message: "File too large. Maximum file size is 10MB.",
        error: "FILE_TOO_LARGE",
      });
    }
    // Handle other Multer errors
    return res.status(400).json({
      status: 400,
      returnCode: -10000000002,
      message: "File upload error",
      error: err.code,
    });
  } else if (err) {
    // Handle other errors
    return res.status(500).json({
      status: 500,
      returnCode: -10000000003,
      message: "An unexpected error occurred during file upload",
      error: "INTERNAL_SERVER_ERROR",
    });
  }
  next();
};

module.exports = uploadErrorHandler;
