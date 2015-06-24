exports.sensors = function(req, res){
res.render('sensors', { title: 'Express' });
};


exports.sensordata = function(req, res){
	console.log('Calling sensordata');	
	var db = req.db;
    var collection = db.get('sensor-data');
    collection.find(req.query,{},function(e,docs){        
    	res.json(docs);
    });
    
//    collection.find( { $query: req.query, $orderby: { 'name' : 1 } },{}, function(e,docs){        
//    	res.json(docs);
//    });
};


exports.sensorList = function(req, res){
	var db = req.db;
    var collection = db.get('sensor-data');
    collection.find({},{},function(e,docs){
    	var result = [];
    	//console.log(docs);
    	docs.map(function(entry){
    		var sensor = entry;
    		if(typeof sensor.data == 'undefined'){
    			sensor.values = 0;
    		}else {
	    		sensor.values = sensor.data.length;
	    		delete sensor.data;
    		}
    		result.push(sensor);
    	});
    	
    	console.log(result);
        res.json(result);
    });
};