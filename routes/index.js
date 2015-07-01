var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/signin');
}

module.exports = function(passport){

	router.get('/', function(req, res) {
	  res.render('index', { user : req.user });
	});
	
	router.get('/signin', function(req, res){
		 res.render('signin', { user : req.user, message: req.flash('error') });
	});
	
	router.get('/profile', isAuthenticated, function(req, res){
	  //res.render('profile', { title: 'Express' });
		 res.render('profile', { user : req.user });
	});
	
	router.get('/about',function(req, res){
		res.render('about', { title: 'Express' , user : req.user});
	});
	
	router.get('/charts',function(req, res){
		res.render('charts', { title: 'Express' , user : req.user});
	});
	
	router.get('/logout', function(req, res) {
	  var name = req.user.username;
	  console.log("LOGGIN OUT " + req.user.username)
	  req.logout();
	  res.redirect('/');
	  req.session.notice = "You have successfully been logged out " + name + "!";
	});
	
	router.post('/login', passport.authenticate('login', { 
		  successRedirect: '/profile',
		  failureRedirect: '/signin',
		  failureFlash: true
		  })
		);

	router.post('/local-reg', passport.authenticate('signup', {
		successRedirect: '/profile',
		failureRedirect: '/signin',
		failureFlash : true  
	}));
	
	return router;
}