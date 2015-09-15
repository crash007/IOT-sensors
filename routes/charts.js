
var express = require('express');
var router = express.Router();


module.exports = function(){
	
	router.get('/',function(req, res){
		res.render('charts', { title: 'Express' , user : req.user});
	});
	
	router.get('/latest/hour',function(req, res){
		res.render('charts', { title: 'Express' , user : req.user, timeSpan: 'latest/hour'});
	});
	
	router.get('/latest/minute',function(req, res){
		res.render('charts', { title: 'Express' , user : req.user, timeSpan: 'latest/minute'});
	});
	
	router.get('/latest/day',function(req, res){
		res.render('charts', { title: 'Express' , user : req.user, timeSpan: 'latest/day'});
	});
	
	router.get('/latest/week',function(req, res){
		res.render('charts', { title: 'Express' , user : req.user, timeSpan: 'latest/week'});
	});
	
	router.get('/latest/month',function(req, res){
		res.render('charts', { title: 'Express' , user : req.user, timeSpan: 'latest/month'});
	});
	
	router.get('/all',function(req, res){
		res.render('charts', { title: 'Express' , user : req.user, timeSpan: 'all'});
	});
	
		
	return router;
}();