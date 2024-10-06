'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('hours_worked', 'employeeId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'employees',
        key: 'id',
      },
      onDelete: 'CASCADE',
    });

    await queryInterface.changeColumn('weekly_summary', 'employeeId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'employees',
        key: 'id',
      },
      onDelete: 'CASCADE',
    });

    await queryInterface.changeColumn('biweekly_summary', 'employeeId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'employees',
        key: 'id',
      },
      onDelete: 'CASCADE',
    });

    await queryInterface.changeColumn('monthly_summary', 'employeeId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'employees',
        key: 'id',
      },
      onDelete: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('hours_worked', 'employeeId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'employees',
        key: 'id',
      },
      onDelete: null,
    });

    await queryInterface.changeColumn('weekly_summary', 'employeeId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'employees',
        key: 'id',
      },
      onDelete: null,
    });

    await queryInterface.changeColumn('biweekly_summary', 'employeeId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'employees',
        key: 'id',
      },
      onDelete: null,
    });

    await queryInterface.changeColumn('monthly_summary', 'employeeId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'employees',
        key: 'id',
      },
      onDelete: null,
    });
  },
};

