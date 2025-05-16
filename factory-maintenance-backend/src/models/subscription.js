'use strict';

module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define('Subscription', {
    planType: {
      type: DataTypes.ENUM('monthly', 'annual'),
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'USD'
    },
    status: {
      type: DataTypes.ENUM('active', 'expired', 'cancelled', 'trial'),
      defaultValue: 'trial'
    },
    isTrial: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    trialEndDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    stripeSubscriptionId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    stripePaymentIntentId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    autoRenew: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    invoiceUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    notificationPreference: {
      type: DataTypes.ENUM('email', 'in-app', 'both', 'none'),
      defaultValue: 'both'
    },
    maxUsers: {
      type: DataTypes.INTEGER,
      defaultValue: 10
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    lastModifiedBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    lastNotificationSent: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {});

  Subscription.associate = function(models) {
    // Subscription belongs to a Company
    Subscription.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company'
    });
    
    // Subscription has many Payments
   
    
    // Created by user (Admin)
    Subscription.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });
    
    // Last modified by user (Admin)
    Subscription.belongsTo(models.User, {
      foreignKey: 'lastModifiedBy',
      as: 'modifier'
    });
  };
  
  // Instance methods
  Subscription.prototype.isExpiring = function(daysThreshold = 7) {
    const today = new Date();
    const diffTime = this.endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= daysThreshold && diffDays > 0;
  };
  
  Subscription.prototype.isTrialExpiring = function(daysThreshold = 2) {
    if (!this.isTrial) return false;
    
    const today = new Date();
    const diffTime = this.trialEndDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= daysThreshold && diffDays > 0;
  };

  return Subscription;
};