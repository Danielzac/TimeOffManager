"use strict";

module.exports = function(sequelize, DataTypes) {
  var Group = sequelize.define("Group", {
   groupid: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  }
  }, {
    timestamps: false,
    classMethods: {
      associate: function(models) {
        Group.hasMany(models.Users);
      }
    }
  });

  return Group;
};