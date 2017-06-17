var express = require('express');
var models = require('../models')
var router = express.Router();
var sequelize = require('sequelize');

router.get('/', function(req, res, next) {
	models.Users.find({
		where: {userid: req.cookies.userid,
				password: req.cookies.password}
	}).then(function(user){
		if(user.fullAdmin){
			models.Users.findAll().then(function(userinfo) {
				res.render('userpasswords', {user: user, cookies: req.cookies, userinfo: userinfo});
			});
		} else {
			res.send('You do not have permission to access this page');
		}
	});
});

router.get('/:id', function(req, res, next) {
	models.Users.find({
		where: {userid: req.cookies.userid,
				password: req.cookies.password}
	}).then(function(user){
		if(user.fullAdmin){
			models.Users.find({
				where: {
					userid: req.params.id
				}
			}).then(function(userinfo) {
				res.render('updateuserpasswords', {user: user, cookies: req.cookies, userinfo: userinfo});
			});
		} else {
			res.send('You do not have permission to access this page');
		}
	});
});

router.post('/:id', function(req, res, next) {
	models.Users.find({
		where: {userid: req.cookies.userid,
				password: req.cookies.password}
	}).then(function(user){
		if(user.fullAdmin){
			models.Users.update({
					password: req.body.newpassword
				},{
					where: {
						userid: req.params.id
					}}).then(function() {
						res.redirect('/calendar');
					});
		} else {
			res.send('You do not have permission to access this page');
		}
	});
});

module.exports = router;