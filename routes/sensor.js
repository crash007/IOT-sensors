
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
	
	router.get('/:name/json',function(req, res){			
		var db = req.db;
	    var collection = db.get('sensor-data');	    
	    var projection = {};
	   	    
	    collection.findOne({'name' : req.params.name} ,  {fields :{userId:0, _id:0} } , function(e,docs){        
	    	res.json(docs);
	    });
	});
		
	return router;
}();