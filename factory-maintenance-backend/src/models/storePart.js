'use strict';

module.exports = (sequelize, DataTypes) => {
  const StorePart = sequelize.define('StorePart', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    partNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    file: {
      type: DataTypes.STRING,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {});

  StorePart.associate = function(models) {
    // StorePart belongs to a Company
    StorePart.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company'
    });

    // StorePart belongs to a Location
    StorePart.belongsTo(models.Location, {
      foreignKey: 'locationId',
      as: 'location'
    });

    // StorePart can be associated with many WorkOrders through a join table
    StorePart.belongsToMany(models.WorkOrder, {
      through: 'WorkOrderParts',
      as: 'workOrders',
      foreignKey: 'storePartId'
    });
  };

  return StorePart;
};