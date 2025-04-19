'use strict';

module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {});

  Location.associate = function(models) {
    // Location belongs to a Company
    Location.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company'
    });

    // Location has many Equipment/Machines
    Location.hasMany(models.Equipment, {
      foreignKey: 'locationId',
      as: 'equipment'
    });

    // Location has many StoreParts
    Location.hasMany(models.StorePart, {
      foreignKey: 'locationId',
      as: 'storeParts'
    });

    // Location has many WorkOrders
    Location.hasMany(models.WorkOrder, {
      foreignKey: 'locationId',
      as: 'workOrders'
    });
  };

  return Location;
};