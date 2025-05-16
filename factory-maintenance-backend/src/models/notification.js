'use strict';

module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    type: {
      type: DataTypes.ENUM(
        'new_task', 
        'task_update', 
        'request_approved', 
        'request_rejected', 
        'pm_reminder', 
        'subscription_expiring', 
        'part_low_stock'
      ),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    targetUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    relatedId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'ID of the related entity (work order, request, etc.)'
    },
    relatedType: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Type of the related entity (WorkOrder, MaintenanceRequest, etc.)'
    }
  }, {});

 Notification.associate = function(models) {
  // Notification belongs to a User
  Notification.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });

  // Notification belongs to a Company
  Notification.belongsTo(models.Company, {
    foreignKey: 'companyId',
    as: 'company'
  });

  // Notification belongs to a Subscription
  Notification.belongsTo(models.Subscription, {
    foreignKey: 'subscriptionId',
    as: 'subscription'
  });
};

  return Notification;
};