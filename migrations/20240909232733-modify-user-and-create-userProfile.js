"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create UserProfile table
    await queryInterface.createTable("UserProfiles", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      profilePicture: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("now"),
      },
    });

    // Check if the columns already exist before adding them
    // await queryInterface.addColumn('Users', 'confirmationToken', {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    // });

    // await queryInterface.addColumn('Users', 'resetPasswordToken', {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    // });

    // await queryInterface.addColumn('Users', 'resetPasswordExpires', {
    //   type: Sequelize.DATE,
    //   allowNull: true,
    // });
  },

  async down(queryInterface, Sequelize) {
    // Drop UserProfile table
    await queryInterface.dropTable("UserProfiles");

    // Remove columns from Users table
    // await queryInterface.removeColumn('Users', 'confirmationToken');
    // await queryInterface.removeColumn('Users', 'resetPasswordToken');
    // await queryInterface.removeColumn('Users', 'resetPasswordExpires');
  },
};
