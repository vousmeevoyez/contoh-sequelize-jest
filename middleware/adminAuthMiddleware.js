const adminAuthMiddleware = async (req, res, next) => {
  if (req.body.role === "admin") {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized to create admin account" });
    }
  }
  next();
};

module.exports = adminAuthMiddleware;
