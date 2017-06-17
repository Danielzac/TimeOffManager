var express = require('express');
var models = require('../models')
var router = express.Router();
var sequelize = require('sequelize');

router.get('/', function(req, res, next) {
	var date = new Date();
	var year = date.getFullYear();
	var endofyear = new Date(year, 12, 31);
	var startofyear = new Date(year, 1, 1);
	console.log(endofyear);
	console.log(startofyear);
	console.log("this is:" + year);
	models.Users.find({
		where: {userid: req.cookies.userid,
				password: req.cookies.password}
	}).then(function(user){
		if(user){
			if(user.isAdmin){
				models.Users.findAll().then(function(users) {
					//console.log(counts[28].enddate - counts[28].startdate +  Date.parse("Thu, 01 Jan 1970 " + counts[28].endtime + " GMT") - Date.parse("Thu, 01 Jan 1970 " + counts[28].starttime + " GMT"));
					res.render('users', {cookies: req.cookies, users: users});
			});
		}
		} else {
			res.redirect('login');
		}
	});
});

	//need to do a put for upgrading to admin status... maybe change colors too

module.exports = router;