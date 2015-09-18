
var express = require('express');
var router = express.Router();
var isAuthenticated = require('../modules/isAuthenticated.js').isAuthenticated;
var jsonResponseHandler = require('../modules/json-response-handler.js');
var ObjectId = require('mongodb').ObjectID;

module.exports = function(){
	
	router.get('/',isAuthenticated, function(req, res){
		var collection = req.db.get('sensor-data');
		//get sensors with triggers for this user
		collection.col.aggregate(
	   		 // Start with a $match pipeline which can take advantage of an index and limit documents processed
	   		  { $match : {
	   		     "triggers.twitter.username":  req.user.username
	   		  }},
	   		  { $unwind : "$triggers.twitter" },	   		  
	   		  { $match : {"triggers.twitter.username": req.user.username}
	   		  },
	   		  { $group:	{_id: '$_id', twitter: {$push: '$triggers.twitter'}, name: {$first: '$name'}}
	   		  },
	   		  
	   		  ///Result contains sensor name and twitter array.
	   		  function(err,result){
	   			  console.log(result);

	   			  res.render('triggers/triggers', {user : req.user, triggers:result});
	   		  }
	   );
		
	});	

	router.get('/twitter/add',isAuthenticated,function(req, res){
		
	    var collection = req.db.get('sensor-data');
	    var projection = {};		
	    projection.data=0;
	    
		collection.find({} ,  {fields : projection, sort:'username'} , function(e,docs){
			console.log(docs);
			res.render('triggers/twitter-react-config', { user : req.user, sensors:docs});	
	    });	    
	});
	
	
	router.post('/twitter/add',isAuthenticated,function(req, res){
		
	    console.log(req.body);
	    var trigger = req.body;
		var collection = req.db.get('sensor-data');	
		trigger.username = req.user.username;		
		console.log("Adding twitter trigger to sensor: ");
		
		
		var sensorId = trigger.sensorId;
		delete trigger.sensorId;
		console.log(trigger);
		//Try to update existing
		collection.update({_id: sensorId, 
				"triggers.twitter":{ $elemMatch: {name: trigger.name, 
						username: trigger.username
						}} 
				}
				 ,
				{
					$set: 
					{
						"triggers.twitter.$": trigger
					}
				},
				{w:1}, 
				function(err, result) {
					
					console.log(err);
					console.log(result);
					//No match was found. 
					if(result == 0){
						console.log("No existing trigger with this settings. adding this one to array");
						collection.update({_id: sensorId}, {$addToSet: {"triggers.twitter": trigger }}, {w:1}, function(err, result) {
							jsonResponseHandler.sendResponse(res,err,result,"Problems adding twitter trigger.");
						});
					}
					//			
				}
		);    
	});
			
	return router;
}();
