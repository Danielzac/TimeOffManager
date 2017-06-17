var express = require('express');
var Sequelize = require('sequelize');
var models = require('../models');
var router = express.Router();

router.get('/', function(req, res, next){
	console.log("Enter Register route");
    res.render('register', {cookies: req.cookies});
});

router.post('/', function(req, res, next){
	console.log("Register POST route");
	var form = req.body;
    models.Users.find({
    where: {userid: req.cookies.userid,
        password: req.cookies.password}
  }).then(function(user){
    if(user){
        models.Users.create({
            name: form.name,
            email: form.email,
            password: form.password
        }).then(function(user){
            models.UserDays.create({
                        UserUserid: user.userid
                    }).then(function(){
                        res.redirect("calendar");
                    });
                });      
    } else {
      res.redirect('login');
    }        
    });
});

module.exports = router;