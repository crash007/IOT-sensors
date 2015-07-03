
var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/signin');
}

module.exports = function(){
	
	router.get('/',function(req, res){
		res.render('sensors', { user: req.user, title: 'Express' });
	});
	
	router.get('/chart/:chartName',function(req, res){
		res.render('chart',{  user: req.user, chartName : req.params.chartName}
		);
	});
	
	
	router.get('/json/:name',function(req, res){			
		var db = req.db;
	    var collection = db.get('sensor-data');	    
	    var projection = {};
	   	    
	    collection.findOne({'name' : req.params.name} ,  {fields :{userId:0, _id:0} } , function(e,docs){        
	    	res.json(docs);
	    });
	});
	
	router.get('/json',function(req, res){			
		var db = req.db;
	    var collection = db.get('sensor-data');
	    var query = req.query;
	    var projection = {};
	    console.log(query);
	    if(query.excludeData==='true'){
	    	console.log("Excluding data");
	    	projection.data=0;	    	
	    }
	    	    
	    if (query.mySensors === 'true'){
	    	if(req.isAuthenticated()){    	
	    		query.userId = req.user._id;
	    	} 
		    else{
		    	res.json({error:'Not logged in'});
		    	return;
		    }
	    }
	    
	    delete query.excludeData;
	    delete query.mySensors;
	    collection.find(query ,  {fields : projection} , function(e,docs){        
	    	res.json(docs);
	    });
    
	});
		
	return router;
}();