
var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/signin');
}

function add(db,sensorId,value,time,res){
	
	var collection = db.get('sensor-data');
	
	if(typeof time === 'undefined'){
		time = new Date();
	}else{
		time = new Date(time);
	}
	
	var data = {value: parseFloat(value), time: time};
	
	console.log("Adding value to sensor: "+sensorId+" , data: "+data.value+" "+data.time);
	
	collection.update({_id:sensorId},
		{$push: { 'data':data } }, {w:1}, function(err, result) {
			if(err !==null){
				console.log(err);
			}
			
			res.send(
		        (err === null) ? { msg: result } : { msg: err }
		    );
		}
	);
}

module.exports = function(){
	
	router.post('/add-data',  function(req, res){				
		add(req.db, req.body.sensorId, req.body.value, req.body.time, res);
	});
	
	router.get('/add-data',  function(req, res){
		add(req.db, req.query.sensorId, req.query.value, req.query.time, res);
	});
	
	
	router.post('/add-sensor', isAuthenticated, function(req, res){
		var db = req.db;
		var collection = db.get('sensor-data');
		var sensor = req.body;
		sensor.data = [];
		sensor.userId= req.user._id;
		sensor.username=req.user.username;
		collection.insert(sensor, function(err, result){
		    res.send(
		        (err === null) ? { msg: '' } : { msg: err }
		    );
		});
	});
	
	
	router.post('/edit-sensor', isAuthenticated,function(req, res){
		var db = req.db;
		var collection = db.get('sensor-data');
		var sensorId = req.body.id;
		var params = req.body;
		//Update everything except _id
		delete params.sensorId;
		
		collection.update({_id:sensorId, userId: req.user._id}, {$set: params }, {w:1}, function(err, result) {
			if(err !== null){
				console.log(err);
			}
			res.send(
		        (err === null) ? { msg: '' } : { msg: err }
		    );
		});
	});
	
	
	router.post('/edit-data', isAuthenticated,function(req, res){
		var db = req.db;
		var collection = db.get('sensor-data');
		console.log(req.body);
		var id = req.body.id;
		var prevValue = parseFloat(req.body.prevValue);
		var prevTime = new Date(req.body.prevTime);
		var value = parseFloat(req.body.value);
		var time = new Date(req.body.time);
		
		collection.update(
				{
					_id:id, 
					userId: req.user._id,
					
					data: { $elemMatch: {value: prevValue, 
						time: prevTime
						}}
					
				}, 
				{	$set: {
							"data.$.value":value, 
							"data.$.time": time
					}
				}, 
				{w:1}, 
				function(err, result) {
					
					if(err !== null){
						console.log(err);
					}
					
					res.send(
					        (err === null) ? { msg: '' } : { msg: err }
					    );
				});
	});
	
	
	router.post('/del-sensor', isAuthenticated, function(req, res){
		var db = req.db;
		var collection = db.get('sensor-data');
		
		var id = req.body.id;
		console.log("Removing sensor with id: "+id);	
		collection.remove(
				{
					_id:id,
					userId: req.user._id
					
				}, 			 
				{w:1}, 
				function(err, result) {
					console.log(err);
					console.log(result);
					res.send(
				        (err === null) ? { msg: '' } : { msg: err }
				    );
				});
	});
	
	
	router.post('/del-data', isAuthenticated,function(req, res){
		var db = req.db;
		var collection = db.get('sensor-data');
		
		var id = req.body.id;
		var value = parseFloat(req.body.value);
		var time = new Date(req.body.time);
		
		console.log("Removing data with id: "+id+" ,value: "+value+" , time: "+time+", userId"+req.user._id);	
		collection.update(
		    {'_id': id,userId: req.user._id}, 
		    { $pull: { "data" : { value: value} } },
		    {w:1},
		    function(err, result) {
				console.log(err);
				console.log(result);
				res.send(
						(err === null) ? { msg: '' } : { msg: err }
			    );
		    } 
		);
	});
	
	return router;

}();