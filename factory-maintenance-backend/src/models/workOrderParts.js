'use strict';

module.exports = (sequelize, DataTypes) => {
  const WorkOrderParts = sequelize.define('WorkOrderParts', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    workOrderId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    storePartId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    tableName: 'WorkOrderParts',
    timestamps: true
  });

  WorkOrderParts.associate = function(models) {
    // علاقة WorkOrderParts ب WorkOrder
    WorkOrderParts.belongsTo(models.WorkOrder, {
      foreignKey: 'workOrderId',
      as: 'workOrder',
      onDelete: 'CASCADE'
    });

    // علاقة WorkOrderParts ب StorePart
    WorkOrderParts.belongsTo(models.StorePart, {
      foreignKey: 'storePartId',
      as: 'storePart',
      onDelete: 'CASCADE'
    });
  };

  return WorkOrderParts;
};
