"use strict";
const bcrypt = require("bcrypt");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    // Di dalam models/user.js
    static associate(models) {
      User.hasOne(models.UserProfile, {
        foreignKey: "userId",
        as: "profile",
      });
      User.hasMany(models.Post, {
        foreignKey: "userId",
        as: "posts",
      });
      User.hasMany(models.Like, {
        foreignKey: "userId",
        as: "likes",
      });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isEmailConfirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      confirmationToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user",
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  User.addHook(
    "beforeCreate",
    user => (user.password = bcrypt.hashSync(user.password, 10))
  );
  return User;
};
