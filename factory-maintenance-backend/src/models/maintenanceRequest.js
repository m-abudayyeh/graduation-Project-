'use strict';

module.exports = (sequelize, DataTypes) => {
  const MaintenanceRequest = sequelize.define('MaintenanceRequest', {
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
    priority: {
      type: DataTypes.ENUM('high', 'medium', 'low', 'none'),
      defaultValue: 'medium'
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    files: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'converted_to_work_order'),
      defaultValue: 'pending'
    },
    approvalDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {});

  MaintenanceRequest.associate = function(models) {
    // MaintenanceRequest belongs to a Company
    MaintenanceRequest.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company'
    });

    // MaintenanceRequest belongs to a requester (User)
    MaintenanceRequest.belongsTo(models.User, {
      foreignKey: 'requesterId',
      as: 'requester'
    });

    // MaintenanceRequest can be approved/rejected by a User
    MaintenanceRequest.belongsTo(models.User, {
      foreignKey: 'approverId',
      as: 'approver',
      allowNull: true
    });

    // MaintenanceRequest can be for a specific Equipment
    MaintenanceRequest.belongsTo(models.Equipment, {
      foreignKey: 'equipmentId',
      as: 'equipment',
      allowNull: true
    });

    // MaintenanceRequest can be converted to a WorkOrder
    MaintenanceRequest.hasOne(models.WorkOrder, {
      foreignKey: 'maintenanceRequestId',
      as: 'workOrder'
    });
  };

  return MaintenanceRequest;
};