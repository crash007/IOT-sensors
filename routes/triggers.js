
var express = require('express');
var router = express.Router();
var isAuthenticated = require('../modules/isAuthenticated.js').isAuthenticated;

module.exports = function(){
	
	router.get('/',function(req, res){
		res.render('triggers/triggers', {user : req.user});
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
		
		console.log("Adding twitter trigger to sensor: "+sensorId);
		
		collection.update({_id: trigger.sensorId}, {$set: {"triggers.twitter": trigger }}, {w:1}, function(err, result) {
			jsonResponseHandler.sendResponse(res,err,result,"Problems adding twitter trigger.");
			
		});
		
	    
	    
	});
			
	return router;
}();
