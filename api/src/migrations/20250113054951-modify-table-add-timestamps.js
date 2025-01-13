'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('vehicles', 'date');

    await queryInterface.addColumn('vehicles', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('vehicles', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('vehicles', 'date', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.removeColumn('vehicles', 'createdAt');
    await queryInterface.removeColumn('vehicles', 'updatedAt');
  },
};
