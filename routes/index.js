
/*
 * GET home page.
 */
//var config = require('./config.js'), //config file contains all tokens and other private info
//    funct = require('./functions.js'); //funct file contains our helper functions for our Passport and database work

exports.index = function(req, res){
  res.render('index', { user : req.user });
};

exports.signin = function(req, res){
 // res.render('signin', { title: 'Express' });
	 res.render('signin', { user : req.user });
};

exports.profile = function(req, res){
  //res.render('profile', { title: 'Express' });
	 res.render('profile', { user : req.user });
};

exports.logout= function(req, res){
	  var name = req.user.username;
	  console.log("LOGGIN OUT " + req.user.username)
	  req.logout();
	  res.redirect('/');
	  req.session.notice = "You have successfully been logged out " + name + "!";
	};

