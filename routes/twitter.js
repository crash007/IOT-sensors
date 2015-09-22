
var express = require('express');
var router = express.Router();
var Twitter = require('twitter');
var isAuthenticated = require('../modules/isAuthenticated.js').isAuthenticated;
var env = require('../env.js');

module.exports = function(){

	router.get('/',isAuthenticated,function(req, res){
		var client =new Twitter({
			
		  consumer_key: process.env.CONSUMER_KEY,
		  consumer_secret: process.env.CONSUMER_SECRET,
		  access_token_key: req.user.twitter.token,
		  access_token_secret: req.user.twitter.tokenSecret
		});
		
		res.render('twitter', { user : req.user});
	});
	
	router.get('/authz-twitter-success',isAuthenticated,function(req, res){
		res.render('actions/auth/authz-twitter-success', { user : req.user});
	});
	
	router.get('/authz-twitter-success',function(req, res){
		res.render('actions/auth/authz-twitter-failure');
	});
	
	router.get('/tweet',isAuthenticated,function(req, res){
		
		var client =new Twitter({			
		  consumer_key: process.env.CONSUMER_KEY,
		  consumer_secret: process.env.CONSUMER_SECRET,
		  access_token_key: req.user.twitter.token,
		  access_token_secret: req.user.twitter.tokenSecret
		});
		
		console.log(client);
		
		console.log(req.query.msg);
		
		client.post('statuses/update', {status: req.query.msg},  function(error, tweet, response){
			
			if(error){
				console.log(error)
			}else{
				console.log(tweet);  // Tweet body. 
				console.log(response);  // Raw response object.
			}
		});
		
		res.json({status:'success'});
		
		//return null;
	});
	
			
	return router;
}();
