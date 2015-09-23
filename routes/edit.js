
var express = require('express');
var router = express.Router();
var jsonResponseHandler = require('../modules/json-response-handler.js');
var isAuthenticated = require('../modules/isAuthenticated.js').isAuthenticated;
var triggerReactionHandler = require('../modules/triggerReactionHandler.js').triggerReactionHandler;
var ObjectId = require('mongodb').ObjectID;

function add(db,sensorId,apiKey,value,time,res){
	
	var collection = db.get('sensor-data');
	
	if(typeof time === 'undefined'){
		time = new Date();
	}else{
		time = new Date(time);
	}
	
	var data = {value: parseFloat(value), time: time};
	if(data.value===null){
		jsonResponseHandler.sendResponse(res,null,0,"value: Value must be a number");
		return;
	}
	
	if(!ObjectId.isValid(apiKey)){
		jsonResponseHandler.sendResponse(res,null,0,"apiKey: apiKey is not valid ");
		return;
	}
	
	console.log("Adding value to sensor: "+sensorId+", apiKey: "+apiKey+" , data: "+data.value+" "+data.time);
	
	collection.update({_id:sensorId,apiKey: new ObjectId(apiKey)},
		{$push: { 'data':data }, "$set" : { "last_data" : data }  }, {w:1}, function(err, result) {	
			//trigger event handler
			if(result==1){
				triggerReactionHandler(db,sensorId);
			}
			jsonResponseHandler.sendResponse(res,err,result,"Failure when adding data.");						
		}
	);
}

module.exports = function(){
	
	router.post('/add-data',  function(req, res){				
		add(req.db, req.body.sensorId,req.body.apiKey, req.body.value, req.body.time, res);
	});
	
	router.get('/add-data',  function(req, res){
		add(req.db, req.query.sensorId, req.query.apiKey,req.query.value, req.query.time, res);
	});
	
	
	router.post('/add-sensor', isAuthenticated, function(req, res){
		var db = req.db;
		var collection = db.get('sensor-data');
		var sensor = req.body;
		sensor.data = [];
		sensor.userId= req.user._id;
		sensor.username=req.user.username;
		sensor.apiKey= new ObjectId();
		sensor.trigger_reactions=[];
		collection.insert(sensor, function(err, result){
		    res.send(
		        (err === null) ? { status: 'success' } : { status: 'error', message: err }
		    );
		});
	});
	
	
	router.post('/edit-sensor', isAuthenticated,function(req, res){
		var db = req.db;
		var collection = db.get('sensor-data');
		var sensorId = req.body.sensorId;
		var params = req.body;
		//Update everything except _id
		delete params.sensorId;
		
		
		collection.update({_id:sensorId, userId: req.user._id}, {$set: params }, {w:1}, function(err, result) {
			jsonResponseHandler.sendResponse(res,err,result,"Wrong sensor id or userId.");
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
					jsonResponseHandler.sendResponse(res,err,result,"Unable to update. No matching record found.");
				}
		);
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
					jsonResponseHandler.sendResponse(res,err,result,"Unable to remove sensor. Wrong sensor id or userId");
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
		    { $pull: { "data" : { value: value, time: time} } },
		    {w:1},
		    function(err, result) {
		    	jsonResponseHandler.sendResponse(res,err,result,"Unable to remove data. Wrong sensor id or user id.");
		    } 
		);
	});
	
	return router;

}();