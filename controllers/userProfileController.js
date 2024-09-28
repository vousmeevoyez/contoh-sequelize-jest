const { UserProfile, User } = require("../models");
const { uploadToCloudinary } = require("../config/uploadConfig");
const cloudinary = require("../config/cloudinaryConfig");
const { validationResult } = require("express-validator");

const userProfileController = {
  async getAllUserProfiles(req, res) {
    try {
      const profiles = await UserProfile.findAll({
        include: [{ model: User, as: "user" }],
      });
      res.status(200).json({
        success: true,
        message: "User profiles retrieved successfully",
        data: profiles,
      });
    } catch (error) {
      console.error("Error fetching user profiles:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching user profiles",
        error: error.message,
      });
    }
  },

  async getUserProfileById(req, res) {
    try {
      const { id } = req.params;
      const profile = await UserProfile.findOne({
        where: { id },
        include: [{ model: User, as: "user" }],
      });

      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "User profile not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "User profile retrieved successfully",
        data: profile,
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching user profile",
        error: error.message,
      });
    }
  },

  async createUserProfile(req, res) {
    console.log("Starting createUserProfile function");
    const startTime = Date.now();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errors.array(),
      });
    }

    try {
      console.log("Received request body:", req.body);
      console.log("Received file:", req.file);
      const { userId } = req.body;
      const file = req.file;

      // Pemeriksaan Ukuran File
      if (file) {
        console.log("File size:", file.size);
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          return res.status(400).json({
            success: false,
            message: "File size exceeds the limit of 5MB",
          });
        }
      }

      console.log("Searching for user with ID:", userId);
      const userSearchStartTime = Date.now();
      const user = await User.findByPk(userId);
      console.log(
        `Time taken for user search: ${Date.now() - userSearchStartTime}ms`
      );

      if (!user) {
        console.log("User not found for ID:", userId);
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      console.log("User found:", user.id);

      let profileData = { userId };

      if (file) {
        console.log("File detected, starting Cloudinary upload");
        const uploadStartTime = Date.now();
        try {
          const result = await uploadToCloudinary(file);
          console.log("Cloudinary upload successful:", result.public_id);
          console.log(
            `Time taken for Cloudinary upload: ${
              Date.now() - uploadStartTime
            }ms`
          );
          profileData.profilePicture = result.secure_url;
          profileData.cloudinaryId = result.public_id;
        } catch (uploadError) {
          console.error("Error uploading to Cloudinary:", uploadError);
          return res.status(500).json({
            success: false,
            message: "Error uploading image",
            error: uploadError.message,
          });
        }
      }

      console.log("Creating user profile with data:", profileData);
      const profileCreateStartTime = Date.now();
      const profile = await UserProfile.create(profileData);
      console.log(
        `Time taken for profile creation: ${
          Date.now() - profileCreateStartTime
        }ms`
      );
      console.log("User profile created successfully:", profile.id);

      const totalTime = Date.now() - startTime;
      console.log(`Total time taken for createUserProfile: ${totalTime}ms`);

      return res.status(201).json({
        success: true,
        message: "User profile created successfully",
        data: profile,
        executionTime: totalTime,
      });
    } catch (error) {
      console.error("Error in createUserProfile:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while creating user profile",
        error: error.message,
      });
    }
  },

  async updateUserProfile(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errors.array(),
      });
    }

    try {
      const { id } = req.params;
      const file = req.file;

      const profile = await UserProfile.findByPk(id);
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "User profile not found",
        });
      }

      if (file) {
        try {
          if (profile.cloudinaryId) {
            await cloudinary.uploader.destroy(profile.cloudinaryId);
          }

          const result = await uploadToCloudinary(file);
          profile.profilePicture = result.secure_url;
          profile.cloudinaryId = result.public_id;
        } catch (uploadError) {
          console.error("Error updating image on Cloudinary:", uploadError);
          return res.status(500).json({
            success: false,
            message: "Error updating image",
            error: uploadError.message,
          });
        }
      }
      await profile.save();
      res.status(200).json({
        success: true,
        message: "User profile updated successfully",
        data: profile,
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while updating user profile",
        error: error.message,
      });
    }
  },

  async deleteUserProfile(req, res) {
    try {
      const { id } = req.params;

      const profile = await UserProfile.findByPk(id);
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "User profile not found",
        });
      }

      if (profile.cloudinaryId) {
        try {
          await cloudinary.uploader.destroy(profile.cloudinaryId);
        } catch (deleteError) {
          console.error("Error deleting image from Cloudinary:", deleteError);
          // Lanjutkan proses penghapusan meskipun ada kesalahan dengan Cloudinary
        }
      }

      await profile.destroy();
      res.status(200).json({
        success: true,
        message: "User profile deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting user profile:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while deleting user profile",
        error: error.message,
      });
    }
  },
};

module.exports = userProfileController;
