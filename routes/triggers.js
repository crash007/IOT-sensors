
var express = require('express');
var router = express.Router();
var isAuthenticated = require('../modules/isAuthenticated.js').isAuthenticated;
var jsonResponseHandler = require('../modules/json-response-handler.js');
var ObjectId = require('mongodb').ObjectID;

module.exports = function(){
	
	router.get('/',isAuthenticated, function(req, res){
		var collection = req.db.get('sensor-data');
		collection.find({},{fields:{triggers:1,name:1}},function(e,result){
			console.log(result);
			res.render('triggers/triggers', {user : req.user, sensors:result});
		});
		
	});	

	router.get('/add',isAuthenticated,function(req, res){
		
	    var collection = req.db.get('sensor-data');
	    var projection = {};		
	    projection.data=0;
	    
		collection.find({} ,  {fields : projection, sort:'username'} , function(e,docs){
			console.log(docs);
			res.render('triggers/add', { user : req.user, sensors:docs});	
	    });	    
	});
	
	router.get('/twitter/edit/:name',isAuthenticated,function(req, res){
		
	    var collection = req.db.get('sensor-data');
	    var projection = {};		
	    projection.name=1;
	    
	    console.log("name: "+req.params.name);
	    
	    collection.col.aggregate(
	   		 // Start with a $match pipeline which can take advantage of an index and limit documents processed
	   		  { $match : {
	   		     "triggers.username":  req.user.username,
	   		     "triggers.name":  req.params.name,
	   		  }},
	   		  { $unwind : "$triggers" },	   		  
	   		  { $match : {"triggers.name": req.params.name}
	   		  },
	   		  { $group:	{_id: '$_id', trigger: {$push: '$triggers'}, name: {$first: '$name'}}
	   		  },
	   		  
	   		  ///Result contains sensor name and twitter array.
	   		  function(err,result){
	   			  console.log(result[0]);
	   			  
	   			  collection.find({} , {fields : projection, sort:'username'} , function(e,sensors){
					console.log(sensors);
					res.render('triggers/trigger-edit', { user : req.user, sensors:sensors, trigger:result[0].trigger[0]});	
			    });
	   			  
	   			 // res.render('triggers/triggers', {user : req.user, triggers:result});
	   		  }
	    );
	});
	
	
	router.post('/add',isAuthenticated,function(req, res){
		
	    console.log(req.body);
	    var trigger = req.body;
		var collection = req.db.get('sensor-data');	
		trigger.username = req.user.username;		
		console.log("Adding or updating twitter trigger to sensor: ");
		
		var sensorId = trigger.sensorId;
		delete trigger.sensorId;
		trigger.triggered = false;
		console.log(trigger);
		//Try to update existing
		collection.update({_id: sensorId, 
				"triggers":{ $elemMatch: {name: trigger.name, 
						username: trigger.username
						}} 
				}
				 ,
				{
					$set: 
					{
						"triggers.$": trigger
					}
				},
				{w:1}, 
				function(err, result) {
					
					console.log(err);
					console.log(result);
					//No match was found. 
					if(result == 0){
						console.log("No existing trigger with this settings. adding this one to array");
						collection.update({_id: sensorId}, {$addToSet: {"triggers": trigger }}, {w:1}, function(err, result) {
							jsonResponseHandler.sendResponse(res,err,result,"Problems adding trigger.");
						});
					}else{
						console.log('Trigger was successfully updated');
						jsonResponseHandler.sendResponse(res,err,result,"Problems adding trigger.");
					}
					//			
				}
		);    
	});
			
	return router;
}();
