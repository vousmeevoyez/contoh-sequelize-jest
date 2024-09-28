module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    "no-var": "off",
    "prefer-const": "off",
    strict: ["error", "global"],
    // Tambahkan aturan lain sesuai kebutuhan
  },
};
