exports.sensors = function(req, res){
res.render('edit-sensors', { title: 'Express' });
};

exports.data = function(req, res){
res.render('edit-data', { title: 'Express' });
};


exports.addData = function(req, res){
	var db = req.db;
	var collection = db.get('sensor-data');
	var id = req.body['id'];
	var data = {value: parseFloat(req.body['value']), time: new Date(req.body['time'])};
	
	console.log("Adding value to sensor: "+id+" , data: "+data.value+" "+data.time);
	
	collection.update({_id:id},
		{$push: { 'data':data } }, {w:1}, function(err, result) {
			console.log(err);
			console.log(result);
			res.send(
		        (err === null) ? { msg: '' } : { msg: err }
		    );
		}
	);
};


exports.addSensor = function(req, res){
	var db = req.db;
	var collection = db.get('sensor-data');
	collection.insert(req.body, function(err, result){
	    res.send(
	        (err === null) ? { msg: '' } : { msg: err }
	    );
	});
};


exports.editSensor = function(req, res){
	var db = req.db;
	var collection = db.get('sensor-data');
	var sensorId = req.body['sensorId'];
	var params = req.body;
	//Update everything except _id
	delete params.sensorId;
	
	collection.update({_id:sensorId}, {$set: params }, {w:1}, function(err, result) {
		console.log(err);
		console.log(result);
		res.send(
	        (err === null) ? { msg: '' } : { msg: err }
	    );
	});
};


exports.editData = function(req, res){
	var db = req.db;
	var collection = db.get('sensor-data');
	console.log(req.body);
	var id = req.body['id'];
	var prevValue = parseFloat(req.body['prevValue']);
	var prevTime = new Date(req.body['prevTime']);
	var value = req.body['value'];
	var time = new Date(req.body['time']);
	
	collection.update(
			{
				_id:id,
				data: { $elemMatch: {value: prevValue, 
					time: prevTime
					}}
				
			}, 
			{	$set: {
						"data.$.value":value, 
						"data.$.time": time
				}
			}, 
			{w:1}, 
			function(err, result) {
				console.log(err);
				console.log(result);
				res.send(
				        (err === null) ? { msg: '' } : { msg: err }
				    );
			});
};


exports.delSensor = function(req, res){
	var db = req.db;
	var collection = db.get('sensor-data');
	
	var id = req.body["id"];
	console.log("Removing sensor with id: "+id);	
	collection.remove(
			{
				_id:id,
				
			}, 			 
			{w:1}, 
			function(err, result) {
				console.log(err);
				console.log(result);
				res.send(
			        (err === null) ? { msg: '' } : { msg: err }
			    );
			});
};


exports.delData = function(req, res){
	var db = req.db;
	var collection = db.get('sensor-data');
	
	var id = req.body["id"];
	var value = parseFloat(req.body["value"]);
	var time = new Date(req.body["time"]);
	
	console.log("Removing data with id: "+id+" ,value: "+value+" , time: "+time);	
	collection.update(
	    {'_id': id}, 
	    { $pull: { "data" : { value: value } } },
	    {w:1},
	    function(err, result) {
			console.log(err);
			console.log(result);
			res.send(
			        (err === null) ? { msg: '' } : { msg: err }
		    );
	    } 
	);
};