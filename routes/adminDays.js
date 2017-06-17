var express = require('express');
var models = require('../models')
var router = express.Router();
var sequelize = require('sequelize');

function hmsToSeconds(s) {
  var b = s.split(':');
  return b[0]*3600 + b[1]*60 + (+b[2] || 0);
}
function getTimeDiff(jsonobj){
	var diff = (parseInt(hmsToSeconds(jsonobj.endtime)) - parseInt(hmsToSeconds(jsonobj.starttime)));
	var daydiff = parseInt(jsonobj.enddate - jsonobj.startdate) / 1000;
	var totaldiff = (diff + daydiff)/3600;
	var days = 0;
	if(totaldiff <= 4) {
		days += 0.5;
	} else if (totaldiff > 24) {
		days += Math.ceil(totaldiff/24);
		console.log(days);
	} else {
		days += 1;
	}
	console.log(days);
	return days;
}

router.get('/', function(req, res, next) {
	var date = new Date();
	var year = date.getFullYear();
	var endofyear = new Date(year, 11, 31);
	var startofyear = new Date(year, 0, 1);
	console.log(endofyear);
	console.log(startofyear);
	console.log("this is:" + year);
	models.Users.find({
		where: {userid: req.cookies.userid,
				password: req.cookies.password}
	}).then(function(user){
		if(user){
			if(user.fullAdmin || user.userid == 14){
				models.Daysoff.findAll({
					attributes: ['startdate', 'enddate','starttime', 'endtime', 'UserUserid', 'TypeTypeid'],
					where: {
						enddate: {lte: endofyear},
						startdate: {gte: startofyear}
					}
				}).then(function(counts){
					models.Users.findAll({
						include: [{model: models.UserDays}],
						order: 'name ASC'
					}).then(function(users) {

						for(var i in counts) {
							counts[i].dataValues.timediff = getTimeDiff(counts[i]);
						}

						for(var k in users) {
							var vacationdays = 0;
							var sickdays = 0;
							var trainingdays = 0;
							var statdays = 0;
							var otherdays = 0;
							var bereavementdays = 0;
							for(var j in counts){
								if(counts[j].UserUserid == users[k].userid){
									if(counts[j].TypeTypeid == 1){
										vacationdays += counts[j].dataValues.timediff;
									} else if(counts[j].TypeTypeid == 4) {
										sickdays += counts[j].dataValues.timediff;
									} else if(counts[j].TypeTypeid == 5) {
										trainingdays += counts[j].dataValues.timediff;
									} else if(counts[j].TypeTypeid == 7) {
										bereavementdays += counts[j].dataValues.timediff;
									} else if(counts[j].TypeTypeid == 8) {
										otherdays += counts[j].dataValues.timediff;
									} else {
										statdays += counts[j].dataValues.timediff;
									}
								} 
							}
							console.log(vacationdays + " ::: " + sickdays + " ::: " + trainingdays + " ::: ")
							users[k].dataValues.vacationdays = vacationdays;
							users[k].dataValues.sickdays = sickdays;
							users[k].dataValues.trainingdays = trainingdays;
							users[k].dataValues.statdays = statdays;
							users[k].dataValues.otherdays = otherdays;
							users[k].dataValues.bereavementdays = bereavementdays;
						}

						res.render('adminDays', {cookies: req.cookies, users: users, fullAdmin: true});
					});
				}) ;
			} else if(user.isAdmin) {
				models.Daysoff.findAll({
					attributes: ['startdate', 'enddate','starttime', 'endtime', 'UserUserid', 'TypeTypeid'],
					where: {
						enddate: {lt: endofyear},
						startdate: {gt: startofyear}
					}
				}).then(function(counts){
					models.Users.findAll({
						include: [{model: models.UserDays}],
						where: {
							GroupGroupid: user.GroupGroupid
						},
						order: 'name ASC'
					}).then(function(users) {

						for(var i in counts) {
							counts[i].dataValues.timediff = getTimeDiff(counts[i]);
						}

						for(var k in users) {
							var vacationdays = 0;
							var sickdays = 0;
							var trainingdays = 0;
							var statdays = 0;
							for(var j in counts){
								if(counts[j].UserUserid == users[k].userid){
									if(counts[j].TypeTypeid == 1){
										vacationdays += counts[j].dataValues.timediff;
									} else if(counts[j].TypeTypeid == 4) {
										sickdays += counts[j].dataValues.timediff;
									} else if(counts[j].TypeTypeid == 5) {
										trainingdays += counts[j].dataValues.timediff;
									} else {
										statdays += counts[j].dataValues.timediff;
									}
								} 
							}
							console.log(vacationdays + " ::: " + sickdays + " ::: " + trainingdays + " ::: ")
							users[k].dataValues.vacationdays = vacationdays;
							users[k].dataValues.sickdays = sickdays;
							users[k].dataValues.trainingdays = trainingdays;
							users[k].dataValues.statdays = statdays;
						}

						res.render('adminDays', {cookies: req.cookies, users: users});
					});
				}) ;
			} else {
				res.send("You do not have permissions to view this page. Contact Daniel to be denied access.");
			}
		} else {
			res.redirect('login');
		}
	});

	

});

module.exports = router;