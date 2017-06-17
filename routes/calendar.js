var express = require('express');
var models = require('../models');
var sequelize = require('sequelize');
var router = express.Router();

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
	var date = new Date();
	var year = date.getFullYear();
	var endofyear = new Date(year, 12, 31);
	var startofyear = new Date(year, 1, 1);
	//console.log("this is:" + year);

	models.Users.find({
		where: {userid: req.cookies.userid,
				password: req.cookies.password}
	}).then(function(users){
		if(users){
			models.Daysoff.findAll({
				attributes: ['startdate', 'enddate','starttime', 'endtime', 'UserUserid', 'TypeTypeid'],
				where: {
					UserUserid: req.cookies.userid,
					enddate: {lt: endofyear},
					startdate: {gt: startofyear}
				}
			}).then(function(counts){
				for(var i in counts) {
					counts[i].dataValues.timediff = getTimeDiff(counts[i]);
				}
				var user = {};
				var vacationdays = 0;
				var sickdays = 0;
				var trainingdays = 0;
				var statdays = 0;
				var bereavementdays = 0;
				var otherdays = 0;
				for(var j in counts){
					if(counts[j].UserUserid == req.cookies.userid){
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
				//console.log(vacationdays + " ::: " + sickdays + " ::: " + trainingdays + " ::: ")
				user.vacationdays = vacationdays;
				user.sickdays = sickdays;
				user.trainingdays = trainingdays;
				user.statdays = statdays;
				user.bereavementdays = bereavementdays;
				user.otherdays = otherdays;
				}
				    models.Type.findAll().then(function(types) {
				    	models.Daysoff.findAll({
				    		include: [{model: models.Users}],
				    		where: {
				    			UserUserid: req.cookies.userid
				    		}
				    	}).then(function(days){
				    		//console.log(users.fullAdmin);
				    		if(users.fullAdmin) {
				    			models.Users.findAll().then(function(allUsers){
				    				res.render('calendar', { title: 'Time-Off Calendar', types: types, days: days,  cookies: req.cookies, user: user, allUsers: allUsers, fullAdmin: true});
				    			});
				    			
				    		} else {
				    			res.render('calendar', { title: 'Time-Off Calendar', types: types, days: days,  cookies: req.cookies, user: user});
				    		}
				    		
						});
					});
			}) ;
		} else {
			res.redirect('login');
		}
	});

});

router.post('/:startday/:starttime/:endday/:endtime/:typeid/:userid/:notes', function(req, res, next){
	console.log("start: "+req.params.startday + " :: "+ req.params.starttime);
	console.log("end: "+req.params.endday+ " :: "+ req.params.endtime);

	models.Users.find({
		where: {userid: req.cookies.userid,
				password: req.cookies.password}
	}).then(function(user) {
		if(user.fullAdmin){
			if(req.params.notes == '') {
				models.Daysoff.create({
					startdate: req.params.startday,
					starttime: req.params.starttime,
					enddate: req.params.endday,
					endtime: req.params.endtime,
					UserUserid: req.params.userid,
					TypeTypeid: req.params.typeid,
					NoteNotesid: 0
				}).then(function() {
					res.cookie("date", req.params.startday);
					console.log('reload calendar');
					res.redirect('/');
				});		
			} else {
				models.Note.create({
					notes: req.params.notes
				}).then(function(newnote){
					models.Daysoff.create({
						startdate: req.params.startday,
						starttime: req.params.starttime,
						enddate: req.params.endday,
						endtime: req.params.endtime,
						UserUserid: req.params.userid,
						TypeTypeid: req.params.typeid,
						NoteNotesid: newnote.notesid
					}).then(function() {
						res.cookie("date", req.params.startday);
						console.log('reload calendar');
						res.redirect('/');
					});		
				})
			}
				
		}
	})
});

router.post('/:startday/:starttime/:endday/:endtime/:typeid/:userid/', function(req, res, next){
	console.log("start: "+req.params.startday + " :: "+ req.params.starttime);
	console.log("end: "+req.params.endday+ " :: "+ req.params.endtime);

	models.Users.find({
		where: {userid: req.cookies.userid,
				password: req.cookies.password}
	}).then(function(user) {
		if(user.fullAdmin){
				models.Daysoff.create({
					startdate: req.params.startday,
					starttime: req.params.starttime,
					enddate: req.params.endday,
					endtime: req.params.endtime,
					UserUserid: req.params.userid,
					TypeTypeid: req.params.typeid,
					NoteNotesid: 0
				}).then(function() {
					res.cookie("date", req.params.startday);
					console.log('reload calendar');
					res.redirect('/');
				});		
				}
			});	
});

router.put('/:id/:startday/:starttime/:endday/:endtime/:typeid/:userid/:notes', function(req, res, next){
	console.log("start: "+req.params.startday + " :: "+ req.params.starttime);
	console.log("end: "+req.params.endday+ " :: "+ req.params.endtime);

	models.Users.find({
		where: {userid: req.cookies.userid,
				password: req.cookies.password}
	}).then(function(user) {
		var noteid;
		if(user.fullAdmin){
			models.Daysoff.find({
				where: {daysoffid: req.params.id}
			}).then(function(dayoff) {
				noteid = dayoff.NoteNotesid;
			}).then(function() {
				if(noteid != 0) {
					models.Note.update({
						notes: req.params.notes
					},{
					where: {
						notesid: noteid
					}
				}).then(function(noteinfo) {
						models.Daysoff.update( {
							startdate: req.params.startday,
							starttime: req.params.starttime,
							enddate: req.params.endday,
							endtime: req.params.endtime,
							UserUserid: req.params.userid,
							TypeTypeid: req.params.typeid,
							NoteNotesid: newnote.notesid
						}, {
							where: {daysoffid: req.params.id}
						}).then(function() {
							res.cookie("date", req.params.startday);
							console.log('reload calendar');
							res.send("updated");
						});
					});
				} else {
					models.Note.create({
						notes: req.params.notes
					}).then(function(newnote){
						models.Daysoff.update( {
							startdate: req.params.startday,
							starttime: req.params.starttime,
							enddate: req.params.endday,
							endtime: req.params.endtime,
							UserUserid: req.params.userid,
							TypeTypeid: req.params.typeid,
						}, {
							where: {daysoffid: req.params.id}
						}).then(function() {
							res.cookie("date", req.params.startday);
							console.log('reload calendar');
							res.send("updated");
						});
					});
				}
			});
			if(req.params.notes == '') {
				models.Daysoff.update( {
					startdate: req.params.startday,
					starttime: req.params.starttime,
					enddate: req.params.endday,
					endtime: req.params.endtime,
					UserUserid: req.params.userid,
					TypeTypeid: req.params.typeid,
					NoteNotesid: 0
				}, {
					where: {daysoffid: req.params.id}
				}).then(function() {
					res.cookie("date", req.params.startday);
					console.log('reload calendar');
					res.send("updated");
				});
			} else {
				models.Daysoff.update( {
					startdate: req.params.startday,
					starttime: req.params.starttime,
					enddate: req.params.endday,
					endtime: req.params.endtime,
					UserUserid: req.params.userid,
					TypeTypeid: req.params.typeid
				}, {
					where: {daysoffid: req.params.id}
				}).then(function() {
					res.cookie("date", req.params.startday);
					console.log('reload calendar');
					res.send("updated");
				});
			}
			
		}
	});
});


router.delete('/:id', function(req, res, next){
	console.log("id for delete is:::::: "+req.params.id);
	models.Users.find({
		where: {userid: req.cookies.userid,
				password: req.cookies.password}
	}).then(function(user) {
		if(user.fullAdmin){
			models.Daysoff.destroy({
					where: {
						daysoffid: req.params.id
					}
				}).then(function() {
					res.send("complete");
				});
		}
	});
});


module.exports = router;


