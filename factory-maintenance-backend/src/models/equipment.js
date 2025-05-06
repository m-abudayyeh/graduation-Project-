'use strict';

module.exports = (sequelize, DataTypes) => {
  const Equipment = sequelize.define('Equipment', {
    name: {
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
    model: {
      type: DataTypes.STRING,
      allowNull: true
    },
    manufacturer: {
      type: DataTypes.STRING,
      allowNull: true
    },
    serialNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    file: {
      type: DataTypes.STRING,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    purchaseDate: {
      type: DataTypes.DATEONLY, 
      allowNull: true,
    },
    installationDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    warranty: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastMaintenanceDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    nextMaintenanceDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {    tableName: 'Equipments',freezeTableName: true });

  Equipment.associate = function(models) {
    // Equipment belongs to a Company
    Equipment.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company'
    });

    // Equipment belongs to a Location
    Equipment.belongsTo(models.Location, {
      foreignKey: 'locationId',
      as: 'location'
    });

    // Equipment has many WorkOrders
    Equipment.hasMany(models.WorkOrder, {
      foreignKey: 'equipmentId',
      as: 'workOrders'
    });

    // Equipment has many PreventiveMaintenance schedules
    Equipment.hasMany(models.PreventiveMaintenance, {
      foreignKey: 'equipmentId',
      as: 'preventiveMaintenanceSchedules'
    });

    // Equipment has many MaintenanceRequests
    Equipment.hasMany(models.MaintenanceRequest, {
      foreignKey: 'equipmentId',
      as: 'maintenanceRequests'
    });
  };

  return Equipment;
};