var express = require('express');
var models = require('../models')
var router = express.Router();
var sequelize = require('sequelize');

router.get('/', function(req, res, next) {
	models.Users.find({
		where: {userid: req.cookies.userid,
				password: req.cookies.password}
	}).then(function(user){
		if(user){
			if(user.fullAdmin){
				models.UserDays.findAll({
					include: [{model: models.Users}],
				}).then(function(users) {
					console.log(users);
					res.render('userdays', {cookies: req.cookies, users: users});
			});
		} else {
			res.send('Get out of here. You\'re not allowed in this area! (If you are supposed to be allowed here, contact Daniel)');
		}
		} else {
			res.redirect('login');
		}
	});
});


router.get('/:id', function(req, res, next) {
	models.Users.find({
		where: {userid: req.cookies.userid,
				password: req.cookies.password}
	}).then(function(user){
		if(user){
			if(user.fullAdmin){
				models.UserDays.find({
					include: [{model: models.Users}],
					where: {UserUserid: req.params.id}
				}).then(function(users) {
					console.log(users);
					res.render('userdaysid', {cookies: req.cookies, users: users});
			});
		} else {
			res.send('Get out of here. You\'re not allowed in this area! (If you are supposed to be allowed here, contact Daniel)');
		}
		} else {
			res.redirect('login');
		}
	});
});


router.post('/', function(req, res, next) {
	models.Users.find({
		where: {userid: req.cookies.userid,
				password: req.cookies.password}
	}).then(function(user){
		if(user){
			if(user.fullAdmin){
				models.UserDays.create({
					UserUserid: req.body.user
				}).then(function() {
					res.send('You are not allowed to do this');
				});
		} else {
			res.send('Get out of here. You\'re not allowed in this area! (If you are supposed to be allowed here, contact Daniel)');
		}
		} else {
			res.redirect('login');
		}
	});
});

router.post('/:id', function(req, res, next) {
	console.log("|||||||||||Trying to edit a days off thing||||||||||");
	models.Users.find({
		where: {userid: req.cookies.userid,
				password: req.cookies.password}
	}).then(function(user){
		if(user){
			if(user.fullAdmin){
				models.UserDays.update({
					vacationdaysallowed: req.body.vacationdaysallowed,
					sickdaysallowed: req.body.sickdaysallowed,
					trainingdaysallowed: req.body.trainingdaysallowed,
					statutorydaysallowed: req.body.statutorydaysallowed,
					bereavementdaysallowed: req.body.bereavementdaysallowed,
					otherdaysallowed: req.body.otherdaysallowed},{
						where: {
							UserUserid: req.params.id
						}
				}).then(function() {
					res.redirect('/userdays');
				});
		} else {
			res.send('Get out of here. You\'re not allowed in this area! (If you are supposed to be allowed here, contact Daniel)');
		}
		} else {
			res.redirect('login');
		}
	});
});

module.exports = router;