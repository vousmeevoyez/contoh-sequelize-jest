"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "profilePicture");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "profilePicture", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
