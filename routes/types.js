var express = require('express');
var Sequelize = require('sequelize');
var models = require('../models');
var router = express.Router();

router.get('/', function(req, res, next){
	console.log("Enter Register route");
    res.render('types', {cookies: req.cookies});
});

router.post('/', function(req, res, next){
	console.log("Register POST route");
	var form = req.body;
	models.Type.create({
            type: form.type,
        }).then(function(){
            res.redirect('types');
        });
});

module.exports = router;