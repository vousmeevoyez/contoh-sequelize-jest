"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add unique constraint to email
    await queryInterface.addConstraint("Users", {
      fields: ["email"],
      type: "unique",
      name: "unique_email_constraint",
    });

    // Change username column
    await queryInterface.changeColumn("Users", "username", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });

    // You can add more changes here
  },

  down: async (queryInterface, Sequelize) => {
    // Remove unique constraint from email
    await queryInterface.removeConstraint("Users", "unique_email_constraint");

    // Revert username column changes
    await queryInterface.changeColumn("Users", "username", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    });

    // Revert any other changes you made
  },
};
