
var express = require('express');
var router = express.Router();


module.exports = function(){
	
	router.get('/',function(req, res){		
		var collection = req.db.get('sensor-data');
		collection.find({}, {fields: {_id:0}},function(e,result){
			res.render('sensors', { user: req.user, sensors: result });
		});
	});
	
	
	router.get('/json/all',function(req, res){			
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
	
	
	router.get('/json/latest/minute',function(req, res){			

	    var d = new Date();
	    d.setMinutes(d.getMinutes()-1);
	    queryLatestFromDb(req,res,d)
  
	});
	
	router.get('/json/latest/hour',function(req, res){			

	    var d = new Date();
	    d.setHours(d.getHours()-1);
	    queryLatestFromDb(req,res,d)
  
	});
	
	router.get('/json/latest/day',function(req, res){			

	    var d = new Date();
	    d.setDate(d.getDate()-1);
	    queryLatestFromDb(req,res,d)
  
	});
		
	return router;
}();

function queryLatestFromDb(req,res,fromTime){
	
	var db = req.db;
    var collection = db.get('sensor-data');
    
    collection.col.aggregate(
   		 // Start with a $match pipeline which can take advantage of an index and limit documents processed
   		  { $match : {
   		     "data.time": {$gte: fromTime}
   		  }},
   		  { $unwind : "$data" },
   		  { $match : {"data.time": {$gte: fromTime}}
   		  },
   		  { $group:	{_id: '$_id', data: {$push: '$data'}, name: {$first: '$name'},description: {$first: '$description'},unit: {$first: '$unit'}, username: {$first: '$username'}, latLng: {$first: '$latLng'}, valueSuffix: {$first: '$valueSuffix'}}
   		  },
   		  function(err,result){
   			  console.log(result);
   			  res.json(result);
   		  }
   );
}