/**
 * 
 */
var http = require('http');
var url = require('url');

function uploadSensor(uploadUrl,id,value){
	
	var u = url.parse(uploadUrl);
	console.log(u);
	var sensor = {"sensorId":id, "value":value};
	var sensorString = JSON.stringify(sensor);
	
	var headers = {
	  'Content-Type': 'application/json',
	  'Content-Length': sensorString.length
	};

	var options = {
	  host: u.hostname,
	  port: u.port,
	  path: u.path,
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
	    if(resultObject.status==='success'){
	    	console.log('Successfully uploaded data\n');
	    }else{
	    	console.log("Error: "+resultObject.message);
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