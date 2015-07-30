
var express = require('express');
var router = express.Router();


module.exports = function(){
	
	router.get('/',function(req, res){
		
		var collection = req.db.get('sensor-data');
		collection.find({}, {fields: {_id:0}},function(e,result){
			res.render('sensors', { user: req.user, sensors: result });
		});
			
		
		
	});
	
	router.get('/json',function(req, res){			
		var db = req.db;
	    var collection = db.get('sensor-data');
	    var query = req.query;
	    var projection = {};

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