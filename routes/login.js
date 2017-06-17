var express = require('express');
var Sequelize = require('sequelize');
var models = require('../models');
var router = express.Router();

router.get('/', function(req, res, next){
	console.log("Enter login route");	
    res.render('login');
});

router.post('/', function(req, res, next){
	console.log("Login POST route");
	var form = req.body;
    models.Users.find({
        where: {email: form.email}
    }).then(function(member){
    	if(member === null){
    		res.render('login', {error: "Email does not exist in our database"});
    	} else {
            if(member.validPassword(form.password)){
                res.cookie("userid", member.userid);
                res.cookie("name", member.name);
                res.cookie("email", member.email);
                res.cookie("password", member.password);
                res.redirect('calendar');
            } else {
                res.render('login', {error: "Password is incorrect"});
            }
    		
    	}
    	
    });
});
module.exports = router;