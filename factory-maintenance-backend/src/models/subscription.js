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
      type: DataTypes.ENUM('active', 'expired', 'cancelled'),
      defaultValue: 'active'
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
    }
  }, {});

  Subscription.associate = function(models) {
    // Subscription belongs to a Company
    Subscription.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company'
    });
  };

  return Subscription;
};