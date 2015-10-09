
var express = require('express');
var router = express.Router();
var isAuthenticated = require('../modules/isAuthenticated.js').isAuthenticated;
var jsonResponseHandler = require('../modules/json-response-handler.js');


module.exports = function(){
	
	router.get('/',isAuthenticated, function(req, res){
		var collection = req.db.get('sensor-data');
		var users =  req.db.get('users');
		collection.col.aggregate(
   		 // Start with a $match pipeline which can take advantage of an index and limit documents processed
   		  { $match : {
   		     "trigger_reactions.username":  req.user.username	   		     
   		  }},
   		  { $unwind : "$trigger_reactions" },	   		  
   		  { $match : {"trigger_reactions.username":  req.user.username}
   		  },
   		  { $group:	{_id: '$_id', trigger_reactions: {$push: '$trigger_reactions'}, name: {$first: '$name'}}
   		  },
   		  
   		  ///Result contains sensor name and twitter array.
   		  function(err,reactions){
   			  console.log(reactions);
   			  users.findOne({username:req.user.username},{fields:{timers:1,}},function(e,user){
				console.log(user);
				res.render('triggers/triggers', {user : req.user, sensors:reactions, timers:user.timers});
   			  });		   			  
		    });
	});

	router.get('/reaction/add',isAuthenticated,function(req, res){
		
	    var collection = req.db.get('sensor-data');
	    var projection = {};		
	    projection.data=0;
	    
		collection.find({} ,  {fields : projection, sort:'username'} , function(e,docs){
			console.log(docs);
			res.render('triggers/reactions/add', { user : req.user, sensors:docs});	
	    });	    
	});
	
	router.get('/reaction/json/:name',function(req, res){
		var collection = req.db.get('sensor-data');
			    collection.col.aggregate(	   	
	   		  { $match : {   		     
	   		     "trigger_reactions.name":  req.params.name,
	   		  }},
	   		  { $unwind : "$trigger_reactions" },	   		  
	   		  { $match : {"trigger_reactions.name": req.params.name}
	   		  },
	   		  { $group:	{_id: '$_id', trigger: {$push: '$trigger_reactions'}, name: {$first: '$name'}}
	   		  },
	   		  
	   		  ///Result contains sensor name and twitter array.
	   		  function(err,result){
	   			  if(err) {
	   				  console.log("ERROR");
	   			  }
	   			  if(!err){
	   				  if(result && result[0]){
	   					  res.json({status:'success',data:result[0]});
	   				  }else{
	   					   res.json({status:'success',data:result});
   					  }
	   			  }else{v
	   				  console.log('error')
	   				  res.json({status:'error',message:'Error when getting trigger'});
	   			  }
	   			
	   		  }
	    );
	});
	
	router.get('/reaction/edit/:name',isAuthenticated,function(req, res){
		
	    var collection = req.db.get('sensor-data');
	    var projection = {};		
	    projection.name=1;
	    
	    //console.log("name: "+req.params.name);
	    
	    collection.col.aggregate(	   	
	   		  { $match : {
	   		     "trigger_reactions.username":  req.user.username,
	   		     "trigger_reactions.name":  req.params.name,
	   		  }},
	   		  { $unwind : "$trigger_reactions" },	   		  
	   		  { $match : {"trigger_reactions.name": req.params.name}
	   		  },
	   		  { $group:	{_id: '$_id', trigger: {$push: '$trigger_reactions'}, name: {$first: '$name'}}
	   		  },
	   		  
	   		  ///Result contains sensor name and twitter array.
	   		  function(err,result){
	   			//  console.log(result);	   
	   			  var  trigger ={};
	   			  
	   			  if(result && result[0] && result[0].trigger[0]){
	   				  trigger=result[0].trigger[0];
	   				  trigger.sensorId= result[0]._id;
	   				  trigger.sensorName = result[0].name;
	   			  }
	   			  
	   			  console.log(trigger);
	   			  
	   			  collection.find({} , {fields : projection, sort:'username'} , function(e,sensors){
					console.log(sensors);
					res.render('triggers/reactions/edit', { user : req.user, sensors:sensors, trigger:trigger});	
			    });
	   		  }
	    );
	});
	
	
	router.post('/add',isAuthenticated,function(req, res){
		
		if(req.body.type=='REACTION'){
			addReaction(req,res);
		}
		
		if(req.body.type=='TIMER'){
			addTimer(req,res);
		}
		
	});
	
	router.post('/reaction/remove',isAuthenticated,function(req, res){
		var triggerName = req.body.triggerName;
		console.log(triggerName);
		var collection = req.db.get('sensor-data');
		collection.update(
		    {"trigger_reactions.name" : triggerName}, 
		    { $pull: { "trigger_reactions" : { name: triggerName, username: req.user.username} } },
		    {w:1},
		    function(err, result) {
		    	console.log(err);
		    	console.log(result);
		    	jsonResponseHandler.sendResponse(res,err,result,"Unable to remove trigger. Wrong trigger name or username.");
		    } 
		);		
	});
	
	
	//-------------------- Timers
	
	router.get('/timer/add',isAuthenticated,function(req, res){

		res.render('triggers/timers/add', { user : req.user});		 	    
	});
	
	
	router.get('/timer/json/:name',function(req, res){
		var collection = req.db.get('users');
		    collection.col.aggregate(	   	
	   		  { $match : {   		     
	   		     "timers.name":  req.params.name,
	   		  }},
	   		  { $unwind : "$timers" },	   		  
	   		  { $match : {"timers.name": req.params.name}
	   		  },
	   		  { $group:	{_id: '$_id', timer: {$first: '$timers'}}
	   		  },
	   		  
	   		  ///Result contains sensor name and twitter array.
	   		  function(err,result){
	   			  if(err) {
	   				  console.log("ERROR");
	   			  }
	   			  if(!err){
	   				  if(result && result[0] && result[0].timer){
	   					  var timer = result[0].timer;
	   					  var startDate  = new Date(timer.startDate);
	   					  var stopDate = new Date(timer.stopDate);
	   					  var now = new Date();
	   					  var secondsUntilStart = Math.round((startDate -now)/1000);
	   					  var secondsUntilStop = Math.round((stopDate -now)/1000);
	   					  timer.secondsUntilStart= secondsUntilStart;
	   					  timer.secondsUntilStop= secondsUntilStop;
	   					  res.json({status:'success',data:{timer: timer}});
	   				  }else{
	   					   res.json({status:'success',data:result});
   					  }
	   			  }else{v
	   				  console.log('error')
	   				  res.json({status:'error',message:'Error when getting timer'});
	   			  }
	   		  }
	    );
	});

	
	return router;
}();


function addReaction(req,res){
	
	//console.log(req.body);
	    var trigger = req.body;
		
		trigger.username = req.user.username;		
		console.log("Adding or updating reaction: "+trigger.name);
		
		var sensorId = trigger.sensorId;
		delete trigger.sensorId;
		trigger.triggered = false;
		trigger.value= parseFloat(trigger.value);
		console.log(trigger);
		
		var collection = req.db.get('sensor-data');	
	
		collection.col.aggregate(	   	
	   		  { $match : {	   		     
	   		     "trigger_reactions.name":  trigger.name,
	   		  }},
	   		  { $unwind : "$trigger_reactions" },	   		  
	   		  { $match : {"trigger_reactions.name": trigger.name}
	   		  },
	   		  { $group:	{_id: '$_id', reaction: {$first: '$trigger_reactions'}, name: {$first: '$name'}}
	   		  },
	   		  
	   		  ///Result contains sensor name and twitter array.
	   		  function(err,result){
	   			if(err){
	   				console.log(err);
	   				res.json({ status: 'error',message:'Something went wrong'});
	   			}
	   			if(!err){
	   				console.log(result);
	   				if(result && result[0] && result[0].reaction && result[0].reaction.username ==req.user.username){
	   					//reaction with this name and user exists so we update it.
	   					console.log('Existing trigger with this name and user found. will update reaction');
	   					trigger.triggered = result[0].reaction.triggered;
	   					collection.update({_id: sensorId, 
							"trigger_reactions":{ $elemMatch: {name: trigger.name, 
									username: trigger.username
									}} 
							}
							 ,
							{
								$set: 
								{
									"trigger_reactions.$": trigger
								}
							},
							{w:1}, 
							function(err, result) {
								
								console.log(err);
								console.log(result);
								jsonResponseHandler.sendResponse(res,err,result,"Problems updating reaction.");
											
							}
						);
	   				}else{
	   					//No trigger with this name found so we add a new trigger
	   					console.log('No reaction found with this name, adding a new one');
	   					collection.update({_id: sensorId}, {$addToSet: {"trigger_reactions": trigger }}, {w:1}, function(err, result) {
								jsonResponseHandler.sendResponse(res,err,result,"Problems adding trigger.");
							});
	   				}
	   				
	   			}
	   		  }
		  );
}


function addTimer(req,res){
	
	
    var timer = req.body;
	var users = req.db.get('users');	
	timer.username = req.user.username;		
	
	console.log("Adding or updating timer: "+timer.name);
				
	timer.switchIsOn = false;
		
	users.update({_id: req.user._id, 
			"timers":{ $elemMatch: {name: timer.name}} 
			}
			 ,
			{
				$set: 
				{
					"timers.$": timer
				}
			},
			{w:1}, 
			function(err, result) {
				if(!err){
					if(!result){
						console.log('No timer found with this name, adding a new one');
						users.update({_id: req.user._id}, {$addToSet: {"timers": timer }}, {w:1}, function(err, result) {
							jsonResponseHandler.sendResponse(res,err,result,"Problems adding timer.");
						});
					}
				}else{
					console.log(err);
					console.log(result);
					jsonResponseHandler.sendResponse(res,err,result,"Problems updating timer.");
				}
							
			}
		);
	
	
	
}
