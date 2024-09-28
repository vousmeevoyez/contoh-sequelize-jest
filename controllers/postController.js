const { Post, User, Like } = require("../models");
const jwt = require("jsonwebtoken");
const { uploadToCloudinary } = require("../config/uploadConfig");

const postController = {
  async createPost(req, res) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const { content } = req.body;
      let imageUrl = null;
      let cloudinaryId = null;

      if (req.file) {
        try {
          const result = await uploadToCloudinary(req.file);
          if (result) {
            imageUrl = result.secure_url;
            cloudinaryId = result.public_id;
          }
        } catch (uploadError) {
          console.error("Error uploading to Cloudinary:", uploadError);
          return res.status(500).json({
            status: 500,
            returnCode: -10000000004,
            message: "Could not upload image",
            error: "CLOUDINARY_UPLOAD_ERROR",
          });
        }
      }

      const post = await Post.create({
        content,
        imageUrl,
        cloudinaryId,
        userId,
      });

      res.status(201).json({
        status: 201,
        returnCode: 0,
        message: "Post created successfully",
        data: post,
      });
    } catch (error) {
      console.error("Create post error:", error);
      res.status(500).json({
        status: 500,
        returnCode: -10000000005,
        message: "Could not create post",
        error: "INTERNAL_SERVER_ERROR",
      });
    }
  },

  async likePost(req, res) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const { postId } = req.params;

      // Cek apakah post ada
      const post = await Post.findByPk(postId);
      if (!post) {
        return res.status(404).json({
          status: 404,
          returnCode: -10000000006,
          message: "Post not found",
          error: "POST_NOT_FOUND",
        });
      }

      const [like, created] = await Like.findOrCreate({
        where: { userId, postId },
      });

      if (created) {
        await Post.increment("likeCount", { where: { id: postId } });
        res.status(201).json({
          status: 201,
          returnCode: 0,
          message: "Post liked successfully",
          data: { liked: true, likeCount: post.likeCount + 1 },
        });
      } else {
        res.status(200).json({
          status: 200,
          returnCode: 0,
          message: "Post already liked",
          data: { liked: true, likeCount: post.likeCount },
        });
      }
    } catch (error) {
      console.error("Like post error:", error);
      res.status(500).json({
        status: 500,
        returnCode: -10000000007,
        message: "Could not like post",
        error: "INTERNAL_SERVER_ERROR",
      });
    }
  },

  async unlikePost(req, res) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const { postId } = req.params;

      // Cek apakah post ada
      const post = await Post.findByPk(postId);
      if (!post) {
        return res.status(404).json({
          status: 404,
          returnCode: -10000000008,
          message: "Post not found",
          error: "POST_NOT_FOUND",
        });
      }

      const deleted = await Like.destroy({
        where: { userId, postId },
      });

      if (deleted) {
        await Post.decrement("likeCount", { where: { id: postId } });
        res.status(200).json({
          status: 200,
          returnCode: 0,
          message: "Post unliked successfully",
          data: { liked: false, likeCount: post.likeCount - 1 },
        });
      } else {
        res.status(200).json({
          status: 200,
          returnCode: 0,
          message: "Post was not liked",
          data: { liked: false, likeCount: post.likeCount },
        });
      }
    } catch (error) {
      console.error("Unlike post error:", error);
      res.status(500).json({
        status: 500,
        returnCode: -10000000009,
        message: "Could not unlike post",
        error: "INTERNAL_SERVER_ERROR",
      });
    }
  },

  async getPosts(req, res) {
    try {
      const posts = await Post.findAll({
        include: [
          {
            model: User,
            as: "author",
            attributes: ["id", "username"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json(posts);
    } catch (error) {
      console.error("Get posts error:", error);
      res.status(500).json({ message: "Could not fetch posts" });
    }
  },
};

module.exports = postController;
