'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('WorkOrderParts', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      workOrderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'WorkOrders',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      storePartId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'StoreParts',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('WorkOrderParts');
  }
};
