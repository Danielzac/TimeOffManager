var express = require('express');
var models = require('../models')
var router = express.Router();

router.get('/', function(req, res, next) {
	var finaljson = "[";
    models.Users.find({
    where: {userid: req.cookies.userid,
        password: req.cookies.password}
  }).then(function(user){
    if(user){
        models.Daysoff.findAll({
                include: [
                {model: models.Users},
                {model: models.Type},
                {model: models.Note}]
              }).then(function(alldays){
                for(var day in alldays){
                  if(alldays[day].Note.notes){
                    finaljson += '{"title": "'+alldays[day].User.name+" -- "+alldays[day].Type.type+'", "id": "'+alldays[day].daysoffid+'", "allday": "false", "borderColor": "#000000", "color": "'+alldays[day].Type.color+'", "textColor": "#FFFFFF", "description": "'+alldays[day].User.name+'", "start": "'+alldays[day].startdate.toISOString().substr(0, 10)+' '+ alldays[day].starttime+'", "end": "'+alldays[day].enddate.toISOString().substr(0, 10)+' '+alldays[day].endtime+'", "url": "http://www.google.com", "userid": "'+alldays[day].User.userid+'", "typeid": "'+alldays[day].Type.typeid+'", "notes": "'+alldays[day].Note.notes+'"},';
                  } else {
                    finaljson += '{"title": "'+alldays[day].User.name+" -- "+alldays[day].Type.type+'", "id": "'+alldays[day].daysoffid+'", "allday": "false", "borderColor": "#000000", "color": "'+alldays[day].Type.color+'", "textColor": "#FFFFFF", "description": "'+alldays[day].User.name+'", "start": "'+alldays[day].startdate.toISOString().substr(0, 10)+' '+ alldays[day].starttime+'", "end": "'+alldays[day].enddate.toISOString().substr(0, 10)+' '+alldays[day].endtime+'", "url": "http://www.google.com", "userid": "'+alldays[day].User.userid+'", "typeid": "'+alldays[day].Type.typeid+'", "notes": ""},';
                  }
                }
                finaljson = finaljson.slice(0,-1);
                finaljson += "]";
                //console.log(finaljson);
                res.send(finaljson);
              });
    } else {
      res.redirect('login');
    }
  });
});



module.exports = router;
