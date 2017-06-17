"use strict";

module.exports = function(sequelize, DataTypes) {
  var Type = sequelize.define("Type", {
   typeid: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  }, 
  color: {
    type: DataTypes.STRING,
    defaultValue: "#21406F"
  }

  }, {
    classMethods: {
      associate: function(models) {
        Type.hasOne(models.Daysoff);
      }
    }
  });

  return Type;
};