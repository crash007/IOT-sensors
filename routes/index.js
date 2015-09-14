var express = require('express');
var router = express.Router();
var isAuthenticated = require('../modules/isAuthenticated.js').isAuthenticated;

module.exports = function(passport){

	router.get('/', function(req, res) {
	  res.render('index', { user : req.user });
	});
	
	router.get('/signin', function(req, res){
		 res.render('signin', { user : req.user, message: req.flash('error') });
	});
	
	router.get('/user', isAuthenticated, function(req, res){
		 res.render('settings', { user : req.user });			
	});
		
		
//	router.get('/users/:name',  function(req, res){
//	  
//		if(req.isAuthenticated() && req.params.name === req.user.username){
//		 res.render('profile', { user : req.user });
//		}else{
//			res.render('charts');
//		}
//	});
	
	router.get('/about',function(req, res){
		res.render('about', { title: 'Express' , user : req.user});
	});

	router.get('/logout', function(req, res) {
	  var name = req.user.username;
	  console.log("LOGGIN OUT " + req.user.username)
	  req.logout();
	  res.redirect('/');
	  req.session.notice = "You have successfully been logged out " + name + "!";
	});
	
	router.post('/login', passport.authenticate('login', { 
		  successRedirect: '/user',
		  failureRedirect: '/signin',
		  failureFlash: true
		  })
		);

	router.post('/local-reg', passport.authenticate('signup', {
		successRedirect: '/user',
		failureRedirect: '/signin',
		failureFlash : true  
	}));
	
	router.post('/update-profile', isAuthenticated, function(req, res){
		console.log(req.body);
		var db = req.db;
		var collection = db.get('users');
		var profile = req.body;
		collection.update({_id:req.user._id}, {$set: {email:profile.email, about: profile.about, fullName:profile.fullName} }, {w:1}, function(err, result) {
			if(err !== null){
				console.log(err);
			}
			
			collection.findOne({'_id': req.user._id},{},function(e,user){
	        	if(e){
	        		return done(e);
	        	}
	        	req.user = user;
	        	res.send(
	    		        (err === null) ? { status: 'success', profile:req.user } : { status: 'error', message: err }
	    		    );	        	
	        });
			
			
		});
	});
	

	
	return router;
}