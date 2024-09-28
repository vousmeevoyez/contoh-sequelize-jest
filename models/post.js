"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, {
        foreignKey: "userId",
        as: "author",
      });
      Post.hasMany(models.Like, {
        foreignKey: "postId",
        as: "likes",
      });
    }
  }
  Post.init(
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cloudinaryId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      likeCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};
