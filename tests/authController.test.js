const authController = require("../controllers/authController");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock('crypto', () => ({
  randomBytes: jest.fn().mockReturnValue({
    toString: jest.fn().mockReturnValue('mockedToken')
  })
}));
jest.mock("../models");
jest.mock("../utils/sendEmail");

describe("authController", () => {
  let req;
  let res;
  let mockUser;

  beforeEach(() => {
    req = {
      body: {},
      get: jest.fn().mockReturnValue("localhost:3000"),
      protocol: "http",
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockUser = {
      id: 1,
      email: "test@example.com",
      password: "hashedpassword",
      isEmailConfirmed: true,
      confirmationToken: "someToken",
      confirmationTokenExpires: Date.now() + 3600 * 1000,
      save: jest.fn(),
    };

    User.findOne = jest.fn();
    User.create = jest.fn();
  });

  describe("login", () => {
    it("should return 401 for invalid credentials", async () => {
      req.body = { email: "invalid@example.com", password: "invalidpassword" };
      User.findOne.mockResolvedValue(null);

      await authController.login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
    });

    it("should return a JWT token and user details for valid credentials", async () => {
      req.body = { email: "test@example.com", password: "password" };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("valid-jwt-token");

      await authController.login(req, res);

      expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, mockUser.password);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser.id, role: mockUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      expect(res.json).toHaveBeenCalledWith({
        token: "valid-jwt-token",
        user: {
          id: mockUser.id,
          email: req.body.email,
          role: mockUser.role,
        },
      });
    });

    it("should return 403 if email is not confirmed", async () => {
      mockUser.isEmailConfirmed = false;
      req.body = { email: "test@example.com", password: "password" };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message:
          "Email not confirmed. Please check your email and confirm your account before logging in.",
        confirmationToken: mockUser.confirmationToken,
      });
    });
  });

  describe("register", () => {
    it("should return 400 if required fields are missing", async () => {
      req.body = { username: "", email: "", password: "" };

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "All fields are required" });
    });

    it("should register a new user and send a confirmation email", async () => {
      req.body = { username: "testuser", email: "test@example.com", password: "password" };
      const confirmationToken = "randomtoken";
      crypto.randomBytes.mockReturnValueOnce({ toString: () => confirmationToken });
      bcrypt.hash.mockResolvedValue("hashedpassword");
      User.create.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue("jwt-token");

      await authController.register(req, res);

      expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
        username: "testuser",
        email: "test@example.com",
        password: expect.any(String),
        confirmationToken,
        isEmailConfirmed: false,
      }));
      expect(sendEmail).toHaveBeenCalledWith({
        email: "test@example.com",
        subject: "Please confirm your email",
        message: expect.any(String),
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User registered successfully. Please check your email to confirm your account.",
        token: "jwt-token",
      });
    });
  });

  describe("confirmEmail", () => {
    it("should confirm the user's email if valid token is provided", async () => {
      req.body.token = mockUser.confirmationToken;
      User.findOne.mockResolvedValue({...mockUser, isEmailConfirmed: false});

      await authController.confirmEmail(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ where: { confirmationToken: req.body.token } });
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Email confirmed successfully" });
    });

    it("should return 400 if token is invalid", async () => {
      req.body.token = "invalidToken";
      User.findOne.mockResolvedValue(null);

      await authController.confirmEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid confirmation token" });
    });
  });
});
