const jwt = require("jsonwebtoken");
const { User } = require("../models");

const authMiddleware = {
  async verifyToken(req, res, next) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      res.status(401).json({ message: "Not authorized" });
    }
  },

  isAdmin(req, res, next) {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Require Admin Role" });
    }
  },

  async verifyTokenAndCheckAdmin(req, res, next) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (user.role !== "admin") {
        return res.status(403).json({ message: "Require Admin Role" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      res.status(401).json({ message: "Not authorized" });
    }
  },
};

module.exports = authMiddleware;
