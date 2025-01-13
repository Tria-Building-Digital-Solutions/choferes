'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('vehicles', 'model', 'brand');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('vehicles', 'brand', 'model');
  },
};
