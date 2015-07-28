
var express = require('express');
var router = express.Router();


module.exports = function(){
	
	router.get('/',function(req, res){
		console.log(req.query);
		res.render('sensors', { user: req.user, query: req.query });
	});
	
	router.get('/json',function(req, res){			
		var db = req.db;
	    var collection = db.get('sensor-data');
	    var query = req.query;
	    var projection = {};
	    //console.log(query);
	    if(query.excludeData==='true'){
	    	console.log("Excluding data");
	    	projection.data=0;	    	
	    }
	    	    
	    /*if (query.mySensors === 'true'){
	    	if(req.isAuthenticated()){    	
	    		query.userId = req.user._id;
	    	} 
		    else{
		    	res.json({error:'Not logged in'});
		    	return;
		    }
	    }
	    */
	    delete query.excludeData;
	    delete query.mySensors;
	    collection.find(query ,  {fields : projection} , function(e,docs){        
	    	res.json(docs);
	    });
    
	});
		
	return router;
}();