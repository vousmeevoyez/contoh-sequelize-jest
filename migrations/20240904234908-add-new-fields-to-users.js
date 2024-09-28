"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "profilePicture", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Users", "isEmailConfirmed", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });

    await queryInterface.addColumn("Users", "confirmationToken", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("Users", "resetPasswordToken", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("Users", "resetPasswordExpires", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Users", "profilePicture");
    await queryInterface.removeColumn("Users", "isEmailConfirmed");
    await queryInterface.removeColumn("Users", "confirmationToken");
    await queryInterface.removeColumn("Users", "resetPasswordToken");
    await queryInterface.removeColumn("Users", "resetPasswordExpires");
  },
};
