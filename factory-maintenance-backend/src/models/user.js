'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'supervisor', 'technician', 'requester', 'viewer', 'super_admin'),
      defaultValue: 'requester'
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true
    },
    workStatus: {
      type: DataTypes.ENUM('on_shift', 'end_shift', 'on_call'),
      defaultValue: 'end_shift'
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    passwordResetToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    passwordResetExpires: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {});

  User.associate = function(models) {
    // User belongs to a Company
    User.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company'
    });

    // User can be assigned to many WorkOrders as primary
    User.hasMany(models.WorkOrder, {
      foreignKey: 'primaryAssigneeId',
      as: 'primaryWorkOrders'
    });

    // User can be assigned to many WorkOrders as secondary
    User.hasMany(models.WorkOrder, {
      foreignKey: 'secondaryAssigneeId',
      as: 'secondaryWorkOrders'
    });

    // User can create many maintenance requests
    User.hasMany(models.MaintenanceRequest, {
      foreignKey: 'requesterId',
      as: 'requests'
    });

    // User can approve many maintenance requests
    User.hasMany(models.MaintenanceRequest, {
      foreignKey: 'approverId',
      as: 'approvedRequests'
    });
  };

  return User;
};