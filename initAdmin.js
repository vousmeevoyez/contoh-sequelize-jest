const bcrypt = require("bcrypt");
const { User } = require("./models");
async function createInitialAdmin() {
  try {
    const adminExists = await User.findOne({ where: { role: "admin" } });
    if (!adminExists) {
      const plainPassword = "admin123";
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      await User.create({
        username: "admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
        isEmailConfirmed: true,
      });
      console.log("Initial admin user created");
      console.log("Username: admin");
      console.log("Password: admin123");
    } else {
      console.log("Admin user already exists");
    }
  } catch (error) {
    console.error("Error creating initial admin:", error);
  }
}

module.exports = createInitialAdmin;
