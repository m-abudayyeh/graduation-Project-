'use strict';

module.exports = (sequelize, DataTypes) => {
  const WorkOrder = sequelize.define('WorkOrder', {
    workOrderNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true
    },
    priority: {
      type: DataTypes.ENUM('high', 'medium', 'low', 'none'),
      defaultValue: 'medium'
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    estimatedCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    actualCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    estimatedHours: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: true
    },
    actualHours: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: true
    },
    solution: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    completionDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('open', 'in_progress', 'on_hold', 'completed'),
      defaultValue: 'open'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    externalParts: {
      type: DataTypes.JSONB,  
      defaultValue: [],
      allowNull: true
    },
    externalLocations: {
      type: DataTypes.JSONB,  
      defaultValue: [],
      allowNull: true
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      allowNull: true
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isPreventive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    paranoid: true,
    deletedAt: 'deletedAt'
  });

  WorkOrder.associate = function(models) {
    // WorkOrder belongs to a Company
    WorkOrder.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company'
    });

    // WorkOrder belongs to a Location
    WorkOrder.belongsTo(models.Location, {
      foreignKey: 'locationId',
      as: 'location'
    });

    // WorkOrder belongs to an Equipment/Machine
    WorkOrder.belongsTo(models.Equipment, {
      foreignKey: 'equipmentId',
      as: 'equipment'
    });

    // WorkOrder has a primary assignee (User)
    WorkOrder.belongsTo(models.User, {
      foreignKey: 'primaryAssigneeId',
      as: 'primaryAssignee'
    });

    // WorkOrder has a secondary assignee (User)
    WorkOrder.belongsTo(models.User, {
      foreignKey: 'secondaryAssigneeId',
      as: 'secondaryAssignee',
      allowNull: true
    });

    // WorkOrder can be associated with many StoreParts through a join table
    WorkOrder.belongsToMany(models.StorePart, {
      through: 'WorkOrderParts',
      as: 'parts',
      foreignKey: 'workOrderId'
    });

    // WorkOrder can be created from a MaintenanceRequest
    WorkOrder.belongsTo(models.MaintenanceRequest, {
      foreignKey: 'maintenanceRequestId',
      as: 'maintenanceRequest',
      allowNull: true
    });

    // WorkOrder can be created from a PreventiveMaintenance schedule
    WorkOrder.belongsTo(models.PreventiveMaintenance, {
      foreignKey: 'preventiveMaintenanceId',
      as: 'preventiveMaintenance',
      allowNull: true
    });
  };

  return WorkOrder;
};
