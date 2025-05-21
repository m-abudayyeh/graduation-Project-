'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CustomSolutionsMessage extends Model {
    static associate(models) {
      // define association here if needed
    }
  }
  
  CustomSolutionsMessage.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'CustomSolutionsMessage',
  });
  
  return CustomSolutionsMessage;
};