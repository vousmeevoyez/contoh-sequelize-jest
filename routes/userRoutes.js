const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require("../validations/userValidation");
const { validate } = require("../middleware/validateMiddleware");
const { verifyTokenAndCheckAdmin } = require("../middleware/authMiddleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: The username of the user (unique)
 *         email:
 *           type: string
 *           description: The email of the user (unique)
 *         password:
 *           type: string
 *           description: The hashed password of the user
 *         isEmailConfirmed:
 *           type: boolean
 *           description: Indicates whether the user's email is confirmed
 *           default: false
 *         confirmationToken:
 *           type: string
 *           description: Token used for email confirmation
 *           nullable: true
 *         resetPasswordToken:
 *           type: string
 *           description: Token used for password reset
 *           nullable: true
 *         resetPasswordExpires:
 *           type: string
 *           format: date-time
 *           description: Expiration date for the password reset token
 *           nullable: true
 *         role:
 *           type: string
 *           description: The role of the user
 *           default: "user"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the user was last updated
 */

/**
 * @swagger
 * /users/:
 *   get:
 *     summary: Mendapatkan semua pengguna
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Daftar semua pengguna
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *       500:
 *         description: Kesalahan server
 */
router.get("/", verifyTokenAndCheckAdmin, userController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Mendapatkan pengguna berdasarkan ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID pengguna
 *     responses:
 *       200:
 *         description: Detail pengguna
 *       404:
 *         description: Pengguna tidak ditemukan
 */
router.get("/:id", verifyTokenAndCheckAdmin, userController.getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Memperbarui pengguna berdasarkan ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID pengguna
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nama pengguna
 *               email:
 *                 type: string
 *                 description: Alamat email pengguna
 *               password:
 *                 type: string
 *                 description: Password baru (opsional)
 *               profilePicture:
 *                 type: string
 *                 description: URL gambar profil (opsional)
 *     responses:
 *       200:
 *         description: Pengguna diperbarui
 *       404:
 *         description: Pengguna tidak ditemukan
 */
router.put("/:id", verifyTokenAndCheckAdmin, userController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Menghapus pengguna berdasarkan ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID pengguna
 *     responses:
 *       200:
 *         description: Pengguna dihapus
 *       404:
 *         description: Pengguna tidak ditemukan
 */
router.delete("/:id", verifyTokenAndCheckAdmin, userController.deleteUser);

/**
 * @swagger
 * /users/auth/register:
 *   post:
 *     summary: Registrasi pengguna baru
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nama pengguna
 *               email:
 *                 type: string
 *                 description: Alamat email pengguna
 *               password:
 *                 type: string
 *                 description: Password pengguna
 *     responses:
 *       201:
 *         description: Pengguna berhasil didaftarkan
 *       400:
 *         description: Email atau username sudah digunakan
 */
router.post(
  "/auth/register",
  validate(registerValidation),
  authController.register
);

/**
 * @swagger
 * /users/auth/login:
 *   post:
 *     summary: Login pengguna
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Alamat email pengguna
 *               password:
 *                 type: string
 *                 description: Password pengguna
 *     responses:
 *       200:
 *         description: Berhasil login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT Token
 *       401:
 *         description: Kredensial tidak valid
 */
router.post("/auth/login", validate(loginValidation), authController.login);

/**
 * @swagger
 * /users/auth/confirm-email:
 *   post:
 *     summary: Konfirmasi email dengan token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email berhasil dikonfirmasi
 *       400:
 *         description: Token tidak valid
 */
router.post("/auth/confirm-email", authController.confirmEmail);

/**
 * @swagger
 * /users/auth/forgot-password:
 *   post:
 *     summary: Meminta reset password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Alamat email pengguna
 *     responses:
 *       200:
 *         description: Instruksi reset password dikirim ke email
 *       404:
 *         description: Email tidak ditemukan
 *       500:
 *         description: Kesalahan server
 */
router.post(
  "/auth/forgot-password",
  validate(forgotPasswordValidation),
  authController.forgotPassword
);

/**
 * @swagger
 * /users/auth/reset-password/{resettoken}:
 *   put:
 *     summary: Reset password menggunakan token
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: resettoken
 *         schema:
 *           type: string
 *         required: true
 *         description: Token reset password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: Password baru pengguna
 *     responses:
 *       200:
 *         description: Password berhasil direset
 *       400:
 *         description: Token tidak valid atau expired
 */
router.put(
  "/auth/reset-password/:resettoken",
  validate(resetPasswordValidation),
  authController.resetPassword
);

/**
 * @swagger
 * /users/auth/reset-password/{resettoken}:
 *   put:
 *     summary: Reset password menggunakan token
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: resettoken
 *         schema:
 *           type: string
 *         required: true
 *         description: Token untuk reset password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password berhasil direset
 *       400:
 *         description: Token tidak valid atau expired
 */
router.put(
  "/auth/reset-password/:resettoken",
  validate(resetPasswordValidation),
  authController.resetPassword
);

module.exports = router;
