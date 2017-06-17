var express = require('express');
var router = express.Router();

router.all('/', function(req, res, next){
	console.log("Enter logout route");	
    res.clearCookie("userid");
    res.clearCookie("name");
    res.clearCookie("email");
    res.clearCookie("password");
    res.redirect('login');
});

module.exports = router;
