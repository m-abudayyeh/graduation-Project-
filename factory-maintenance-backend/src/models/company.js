'use strict';

module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    subscriptionStatus: {
      type: DataTypes.ENUM('trial', 'active', 'expired'),
      defaultValue: 'trial'
    },
    subscriptionType: {
      type: DataTypes.ENUM('monthly', 'annual', 'none'),
      defaultValue: 'none'
    },
    subscriptionStartDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    subscriptionEndDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    stripeCustomerId: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {});

  Company.associate = function(models) {
    // Company has many Users
    Company.hasMany(models.User, {
      foreignKey: 'companyId',
      as: 'users'
    });

    // Company has many Locations
    Company.hasMany(models.Location, {
      foreignKey: 'companyId',
      as: 'locations'
    });

    // Company has many Equipment/Machines
    Company.hasMany(models.Equipment, {
      foreignKey: 'companyId',
      as: 'equipment'
    });

    // Company has many StoreParts
    Company.hasMany(models.StorePart, {
      foreignKey: 'companyId',
      as: 'storeParts'
    });

    // Company has many WorkOrders
    Company.hasMany(models.WorkOrder, {
      foreignKey: 'companyId',
      as: 'workOrders'
    });

    // Company has many MaintenanceRequests
    Company.hasMany(models.MaintenanceRequest, {
      foreignKey: 'companyId',
      as: 'maintenanceRequests'
    });
  };

  return Company;
};