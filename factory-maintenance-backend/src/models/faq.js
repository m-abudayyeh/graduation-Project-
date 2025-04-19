'use strict';

module.exports = (sequelize, DataTypes) => {
  const FAQ = sequelize.define('FAQ', {
    question: {
      type: DataTypes.STRING,
      allowNull: false
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {});

  FAQ.associate = function(models) {
    // No associations needed for this model
  };

  return FAQ;
};