var express = require('express');
var Sequelize = require('sequelize');
var models = require('../models');
var router = express.Router();

router.get('/', function(req, res, next){
	console.log("Enter android login route");	
});

router.post('/', function(req, res, next){
	console.log("Login POST route");
	var form = req.body;
    models.Users.find({
        where: {email: form.email}
    }).then(function(member){
    	if(member === null){
    		res.json({response: "Email does not exist in our database", res: false});
    	} else {
            if(member.validPassword(form.password)){
                res.json({response: "Login Succes", res: true, "userid": member.userid, "name": member.name, "email": member.email, "password": member.password});
            } else {
                res.json({response: "Your password does not match our records", res: false});
            }
    		
    	}
    	
    });
});
module.exports = router;