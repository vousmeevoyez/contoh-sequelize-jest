const { User } = require("../models");
const { sequelize } = require("../models");
require("dotenv").config();

describe("User Model", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true }); // This will recreate the database, use with caution
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a user successfully", async () => {
    const userData = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };

    const user = await User.create(userData);

    expect(user).toHaveProperty("id");
    expect(user.username).toBe(userData.username);
    expect(user.email).toBe(userData.email);
    expect(user.password).not.toBe(userData.password); // Password should be hashed
    expect(user.role).toBe("user"); // Default role
    expect(user.isEmailConfirmed).toBe(false);
  });

  it("should not create a user with duplicate email", async () => {
    const userData = {
      username: "testuser2",
      email: "test@example.com", // Same email as previous test
      password: "password123",
    };

    await expect(User.create(userData)).rejects.toThrow();
  });

  it("should not create a user with duplicate username", async () => {
    const userData = {
      username: "testuser", // Same username as first test
      email: "test2@example.com",
      password: "password123",
    };

    await expect(User.create(userData)).rejects.toThrow();
  });

  it("should not create a user without required fields", async () => {
    const userData = {
      username: "testuser3",
    };

    await expect(User.create(userData)).rejects.toThrow();
  });

  it("should not create a user with invalid email", async () => {
    const userData = {
      username: "testuser3",
      email: "invalid-email",
      password: "password123",
    };

    await expect(User.create(userData)).rejects.toThrow();
  });

  it("should create an admin user", async () => {
    const userData = {
      username: "adminuser",
      email: "admin@example.com",
      password: "adminpass123",
      role: "admin",
    };

    const user = await User.create(userData);

    expect(user.role).toBe("admin");
  });

  it("should update user information", async () => {
    const user = await User.create({
      username: "updateuser",
      email: "update@example.com",
      password: "password123",
    });

    user.username = "updateduser";
    await user.save();

    const updatedUser = await User.findByPk(user.id);
    expect(updatedUser.username).toBe("updateduser");
  });

  it("should delete a user", async () => {
    const user = await User.create({
      username: "deleteuser",
      email: "delete@example.com",
      password: "password123",
    });

    await user.destroy();

    const deletedUser = await User.findByPk(user.id);
    expect(deletedUser).toBeNull();
  });
});
