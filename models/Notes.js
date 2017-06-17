"use strict";

module.exports = function(sequelize, DataTypes) {
  var Note = sequelize.define("Note", {
   notesid: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
   },
  notes: {
    type: DataTypes.STRING,
    allowNull: false
  }

  }, {
    classMethods: {
      associate: function(models) {
        Note.hasOne(models.Daysoff);
      }
    }
  });

  return Note;
};