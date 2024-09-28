const express = require("express");
const router = express.Router();
const userProfileController = require("../controllers/userProfileController");
const { upload } = require("../config/uploadConfig");
const { body, param, validationResult } = require("express-validator");

/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfile:
 *       type: object
 *       required:
 *         - userId
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user profile
 *         userId:
 *           type: integer
 *           description: The user ID associated with this profile
 *         profilePicture:
 *           type: string
 *           description: URL of the profile picture
 */

// Middleware sederhana untuk validasi
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * @swagger
 * /profiles:
 *   get:
 *     summary: Retrieve all user profiles
 *     tags: [UserProfiles]
 *     responses:
 *       200:
 *         description: List of all user profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserProfile'
 */
router.get("/", userProfileController.getAllUserProfiles);

/**
 * @swagger
 * /profiles/{id}:
 *   get:
 *     summary: Get a user profile by ID
 *     tags: [UserProfiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User profile ID
 *     responses:
 *       200:
 *         description: User profile details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       404:
 *         description: User profile not found
 */
router.get(
  "/:id",
  param("id").isInt().withMessage("ID harus berupa integer"),
  validate,
  userProfileController.getUserProfileById
);

/**
 * @swagger
 * /profiles:
 *   post:
 *     summary: Create a new user profile
 *     tags: [UserProfiles]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User profile created
 *       400:
 *         description: Invalid input
 */
router.post(
  "/",
  upload.single("profilePicture"),
  [body("userId").isInt().withMessage("User ID harus berupa integer")],
  validate,
  userProfileController.createUserProfile
);

/**
 * @swagger
 * /profiles/{id}:
 *   put:
 *     summary: Update a user profile
 *     tags: [UserProfiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User profile ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User profile updated
 *       404:
 *         description: User profile not found
 */
router.put(
  "/:id",
  upload.single("profilePicture"),
  param("id").isInt().withMessage("ID harus berupa integer"),
  validate,
  userProfileController.updateUserProfile
);

/**
 * @swagger
 * /profiles/{id}:
 *   delete:
 *     summary: Delete a user profile
 *     tags: [UserProfiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User profile ID
 *     responses:
 *       200:
 *         description: User profile deleted
 *       404:
 *         description: User profile not found
 */
router.delete(
  "/:id",
  param("id").isInt().withMessage("ID harus berupa integer"),
  validate,
  userProfileController.deleteUserProfile
);

module.exports = router;
