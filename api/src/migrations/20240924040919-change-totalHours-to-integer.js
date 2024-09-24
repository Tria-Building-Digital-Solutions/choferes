'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('weekly_summary', 'totalHours', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.changeColumn('biweekly_summary', 'totalHours', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.changeColumn('monthly_summary', 'totalHours', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('weekly_summary', 'totalHours', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false,
    });
    await queryInterface.changeColumn('biweekly_summary', 'totalHours', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false,
    });
    await queryInterface.changeColumn('monthly_summary', 'totalHours', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false,
    });
  },
};
