/**
 * 
 */
var http = require('http');

function uploadSensor(id,value){
	var sensor = {"id":id, "value":value, "time":new Date()};
	var sensorString = JSON.stringify(sensor);
	
	var headers = {
	  'Content-Type': 'application/json',
	  'Content-Length': sensorString.length
	};

	var options = {
	  host: 'localhost',
	  port: 3000,
	  path: '/edit/add-data',
	  method: 'POST',
	  headers: headers
	};
	
	var req = http.request(options, function(res) {
	  res.setEncoding('utf-8');

	  var responseString = '';

	  res.on('data', function(data) {
	    responseString += data;
	  });

	  res.on('end', function() {
	    var resultObject = JSON.parse(responseString);
	    //console.log("Response: "+resultObject);
	    if(resultObject.msg===''){
	    	console.log('Successfully uploaded data\n');
	    }else{
	    	console.log("Error: "+resultObject.msg);
	    }
	    
	  });
	  
	});

	req.on('error', function(e) {
	  // TODO: handle error.
		console.log("Error when posting data");
		console.log(e);
		console.log("End of error");
	});
	console.log("Uploading: "+sensorString);	
	req.write(sensorString);
	req.end();
	
}

module.exports.uploadSensor = uploadSensor;