module.exports = {
  testEnvironment: "node",
  setupFiles: ["dotenv/config"],
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
  collectCoverageFrom: ["src/**/*.js", "!**/node_modules/**", "!**/vendor/**"],
  coverageReporters: ["lcov", "text", "text-summary"],
  coverageDirectory: "coverage",
};
