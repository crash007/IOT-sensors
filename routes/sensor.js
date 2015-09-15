
var express = require('express');
var router = express.Router();


module.exports = function(){
	
	router.get('/:chartName',function(req, res){
		res.render('sensor',{  user: req.user, chartName : req.params.chartName}
		);
	});
	
	router.get('/:chartName/chart',function(req, res){
		res.render('chart',{  user: req.user, chartName : req.params.chartName}
		);
	});
	
	router.get('/:name/json/all',function(req, res){			
		var db = req.db;
	    var collection = db.get('sensor-data');	    
	    var projection = {};
	   	    
	    collection.findOne({'name' : req.params.name} ,  {fields :{userId:0,apiKey:0} } , function(e,docs){        
	    	res.json(docs);
	    });
	});
	
	router.get('/:name/json/latest/minute',function(req, res){			

	    var d = new Date();
	    d.setMinutes(d.getMinutes()-1);
	    queryLatestFromDb(req,res,d)
  
	});
	
	router.get('/:name/json/latest/hour',function(req, res){			

	    var d = new Date();
	    d.setHours(d.getHours()-1);
	    queryLatestFromDb(req,res,d)
  
	});
	
	router.get('/:name/json/latest/day',function(req, res){			

	    var d = new Date();
	    d.setDate(d.getDate()-1);
	    queryLatestFromDb(req,res,d)
  
	});
	
	router.get('/:name/json/latest/week',function(req, res){			

	    var d = new Date();
	    d.setDate(d.getDate()-7);
	    queryLatestFromDb(req,res,d)
  
	});
	
	router.get('/:name/json/latest/month',function(req, res){			

	    var d = new Date();
	    d.setMonth(d.getMonth()-1);
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
   		     "data.time": {$gte: fromTime},
   		     name: req.params.name
   		  }},
   		  { $unwind : "$data" },
   		  { $match : {"data.time": {$gte: fromTime}}
   		  },
   		  { $group:	{_id: '$_id', data: {$push: '$data'}, name: {$first: '$name'},description: {$first: '$description'},unit: {$first: '$unit'}, username: {$first: '$username'}, latLng: {$first: '$latLng'}, valueSuffix: {$first: '$valueSuffix'}}
   		  },
   		  function(err,result){
   			  console.log(result);
   			  if(typeof result[0]!=='undefined'){
   				  res.json(result[0]);
   			  }else{
   				  res.json({});
   			  }
   		  }
   );
}

