"use strict";

module.exports = function(sequelize, DataTypes) {
  var EmpGroup = sequelize.define("EmpGroup", {
   empgroupid: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }
  }, {
    timestamps: false,
    classMethods: {
      associate: function(models) {
        EmpGroup.belongsTo(models.Group);
        EmpGroup.belongsTo(models.Users);
      }
    }
  });

  return EmpGroup;
};