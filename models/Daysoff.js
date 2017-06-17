"use strict";
var modelicious;

module.exports = function(sequelize, DataTypes) {
  var Daysoff = sequelize.define("Daysoff", {
   daysoffid: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  startdate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  starttime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  enddate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  endtime: {
    type: DataTypes.TIME,
    allowNull: false
  }
  }, {
    classMethods: {
      associate: function(models) {
        Daysoff.belongsTo(models.Users);
        Daysoff.belongsTo(models.Type);
        Daysoff.belongsTo(models.Note);
        modelicious = models;
      },
      getJSONall: function(){
        var finaljson = "[";
        var superfinal;
        Daysoff.findAll({
          include: [
          {model: modelicious.Users},
          {model: modelicious.Type}]
        }).then(function(alldays){
          for(var day in alldays){
            finaljson += '{title: '+alldays[day].User.name+' , allday: '+alldays[day].Type.type+', borderColor: #f0f0f0, color: #3f3f3f, description: '+alldays[day].name+' , start: '+alldays[day].startdate.toISOString().substr(0, 10)+'T'+ alldays[day].starttime+', end: '+alldays[day].enddate.toISOString().substr(0, 10)+'T'+alldays[day].endtime+' , url: "LibraIT"},';
            //console.log("postupdate"+ finaljson);
          }
          finaljson += "]";
          //console.log(finaljson);
          superfinal = finaljson;
          //return finaljson;
          console.log("hello"+ String(superfinal));
        });
      }

    },
  });

  return Daysoff;
};