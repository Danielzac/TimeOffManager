"use strict";

module.exports = function(sequelize, DataTypes) {
  var CurrentLocation = sequelize.define("CurrentLocation", {
   CurrentLocationid: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  latitude: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
    validate: { min: -90, max: 90 }
  },
  longitude: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
    validate: { min: -180, max: 180 }
  },
  }, {
    classMethods: {
      associate: function(models) {
        CurrentLocation.belongsTo(models.Users);
      }
    }
  });

  return CurrentLocation;
};