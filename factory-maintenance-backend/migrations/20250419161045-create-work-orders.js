'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('WorkOrders', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      workOrderNumber: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      category: {
        type: Sequelize.STRING,
        allowNull: true
      },
      priority: {
        type: Sequelize.ENUM('high', 'medium', 'low', 'none'),
        defaultValue: 'medium'
      },
      images: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: []
      },
      estimatedCost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      actualCost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      estimatedHours: {
        type: Sequelize.DECIMAL(6, 2),
        allowNull: true
      },
      actualHours: {
        type: Sequelize.DECIMAL(6, 2),
        allowNull: true
      },
      solution: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      dueDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      completionDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('open', 'in_progress', 'on_hold', 'completed'),
        defaultValue: 'open'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      externalParts: {
        type: Sequelize.JSONB,  
        defaultValue: [],
        allowNull: true
      },
      externalLocations: {
        type: Sequelize.JSONB,  
        defaultValue: [],
        allowNull: true
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
        allowNull: true
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isPreventive: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      companyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Companies',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      locationId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Locations',
          key: 'id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL'
      },
      equipmentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Equipments',
          key: 'id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL'
      },
      primaryAssigneeId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL'
      },
      secondaryAssigneeId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL'
      },
      maintenanceRequestId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'MaintenanceRequests',
          key: 'id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL'
      },
      preventiveMaintenanceId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'PreventiveMaintenances',
          key: 'id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('WorkOrders');
  }
};