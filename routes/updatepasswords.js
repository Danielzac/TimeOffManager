var express = require('express');
var models = require('../models')
var router = express.Router();
var sequelize = require('sequelize');

router.get('/', function(req, res, next) {
	models.Users.findAll().then(function(users){
		for(var k in users){
			console.log("Number "+k+"   username: "+users[k].name );
			if(users[k].password.length < 15){
				models.Users.update({
				password: users[k].password
			}, {
				where: {
					userid: users[k].userid
				}
			});
			}
		}
	});
	res.send("updating passwords");
});

router.post('/', function(req, res, next) {
	models.Users.find({
		where: {userid: req.cookies.userid,
				password: req.cookies.password}
	}).then(function(user){
		if(user){
			models.Users.update({
					password: req.body.newpassword
				},{
					where: {
						userid: user.userid
					}}).then(function(newpass) {
						res.cookie("password", newpass.password);
						res.redirect('calendar');
					});
		} else {
			res.redirect('login');
		}
	});
});

module.exports = router;