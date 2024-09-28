"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
      Like.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      Like.belongsTo(models.Post, {
        foreignKey: "postId",
        as: "post",
      });
    }
  }
  Like.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Posts",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Like",
      indexes: [
        {
          unique: true,
          fields: ["userId", "postId"],
        },
      ],
    }
  );
  return Like;
};
