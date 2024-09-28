const request = require("supertest");
const { sequelize, User } = require("../models");
const app = require("../app"); // Assuming your Express app is exported from app.js
const sendEmail = require("../utils/sendEmail");

jest.mock("../utils/sendEmail");

describe("Auth API Integration Tests", () => {
  let server;
  const user = {
    username: "newuser",
    email: "newuser@example.com",
    password: "password",
    isEmailConfirmed: true,
  };

  beforeAll(async () => {
    // Sync the database
    await sequelize.sync({ force: true });
    server = app.listen(); // Start the server
  });

  beforeEach(async () => {
    await sequelize.truncate({ cascade: true, restartIdentity: true });
    await User.create(user)

    process.env.JWT_SECRET = 'secret'
  });

  afterAll(async () => {
    await sequelize.close(); // Close database connection
    server.close(); // Stop the server
  });

  describe("POST /login", () => {
    it("should return 401 for invalid credentials", async () => {
      const res = await request(server)
        .post("/api/users/auth/login")
        .send({ email: "invalid@example.com", password: "wrongpassword" });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ message: "Invalid credentials" });
    });

    it("should return 200 and JWT token for valid credentials", async () => {
      const res = await request(server)
        .post("/api/users/auth/login")
        .send({ email: user.email, password: user.password });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user).toEqual({
        id: expect.any(Number),
        email: user.email,
        role: expect.any(String),
      });
    });

    it("should return 403 if email is not confirmed", async () => {
      // Create an unconfirmed user
      await User.create({
        username: "unconfirmeduser",
        email: "unconfirmed@example.com",
        password: 'password',
        isEmailConfirmed: false,
        confirmationToken: "someToken",
      });

      const res = await request(server)
        .post("/api/users/auth/login")
        .send({ email: "unconfirmed@example.com", password: "password" });

      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        message:
          "Email not confirmed. Please check your email and confirm your account before logging in.",
        confirmationToken: "someToken",
      });
    });
  });
});
