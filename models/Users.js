"use strict";
var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define("Users", {
   userid: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    set: function(password) {
      var salt = bcrypt.genSaltSync(9);
      var hash = bcrypt.hashSync(password, salt);
      this.setDataValue('password', hash);
    }
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  fullAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
  }, {
    classMethods: {
      associate: function(models) {
        Users.hasMany(models.Daysoff);
        Users.hasOne(models.UserDays);
        Users.belongsTo(models.Group);
        Users.hasOne(models.CurrentLocation);
      }
    },
    instanceMethods: {
      validPassword: function(password) {
        return bcrypt.compareSync(password, this.password);
      }
    }
  });

  return Users;
};