"use strict";

module.exports = function(sequelize, DataTypes) {
  var UserDays = sequelize.define("UserDays", {
   userdaysid: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  vacationdaysallowed: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10
  },
  sickdaysallowed: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10
  },
  trainingdaysallowed: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 20
  },
  statutorydaysallowed: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 11
  },
  bereavementdaysallowed: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 3
  },
  otherdaysallowed: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
  }, {
    classMethods: {
      associate: function(models) {
        UserDays.belongsTo(models.Users);
      }
    }
  });

  return UserDays;
};