// migrations/20230419123456-create-preventive-maintenance.js
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PreventiveMaintenances', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      frequency: {
        type: Sequelize.ENUM('daily', 'weekly', 'monthly', 'quarterly', 'semi_annually', 'annually', 'custom'),
        defaultValue: 'monthly',
      },
      customFrequencyDays: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      nextDueDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      lastCompletedDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active',
      },
      priority: {
        type: Sequelize.ENUM('high', 'medium', 'low'),
        defaultValue: 'medium',
      },
      instructions: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      equipmentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Equipments',
          key: 'id',
        },
      },
      companyId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Companies',
          key: 'id',
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Dropping the table if the migration is rolled back
    await queryInterface.dropTable('PreventiveMaintenances');
  },
};
