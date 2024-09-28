"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    static associate(models) {
      UserProfile.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }
  UserProfile.init(
    {
      profilePicture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cloudinaryId: {
        type: DataTypes.STRING,
        allowNull: true,
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
      modelName: "UserProfile",
    }
  );
  return UserProfile;
};
