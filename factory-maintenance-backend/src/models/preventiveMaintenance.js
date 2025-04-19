'use strict';

module.exports = (sequelize, DataTypes) => {
  const PreventiveMaintenance = sequelize.define('PreventiveMaintenance', {
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
    frequency: {
      type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'quarterly', 'semi_annually', 'annually', 'custom'),
      defaultValue: 'monthly'
    },
    customFrequencyDays: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nextDueDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    lastCompletedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    },
    priority: {
      type: DataTypes.ENUM('high', 'medium', 'low'),
      defaultValue: 'medium'
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {});

  PreventiveMaintenance.associate = function(models) {
    // PreventiveMaintenance belongs to an Equipment/Machine
    PreventiveMaintenance.belongsTo(models.Equipment, {
      foreignKey: 'equipmentId',
      as: 'equipment'
    });

    // PreventiveMaintenance belongs to a Company
    PreventiveMaintenance.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company'
    });

    // PreventiveMaintenance has many WorkOrders
    PreventiveMaintenance.hasMany(models.WorkOrder, {
      foreignKey: 'preventiveMaintenanceId',
      as: 'workOrders'
    });
  };

  return PreventiveMaintenance;
};