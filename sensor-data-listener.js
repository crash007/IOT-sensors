/**
 * 
 */

var net = require('net');
var http = require('http');
var request = require('request');




function postSensor(sensorString){

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
	    console.log("Response: "+resultObject);
	    console.log(resultObject);
	  });
	  
	});

	req.on('error', function(e) {
	  // TODO: handle error.
		console.log("Error when posting data");
		console.log(e);
		console.log("End of error");
	});
	console.log("Writing to request.");
	console.log(sensorString);
	req.write(sensorString);
	req.end();
	
}

var server = net.createServer(function (socket){
	var date = new Date();
	var dateStr = date.getFullYear() +'-'+ ("0" + (date.getMonth() + 1)).slice(-2) +'-'+ ("0" + date.getDate()).slice(-2) + ' ' + date.getHours()+':'+date.getMinutes()+'\n'; 
	
	socket.write(dateStr);
	
	  socket.on('data', function (data) {
		  var msg = data.toString('utf8');
		  msg = msg.trim();
		  console.log("Received msg: "+msg);
		  
		  var buf = msg.split(';');
		  var id = buf[0].trim();
		  var value = parseFloat(buf[1].trim());
		  var time = new Date();
		  
		  console.log("Id: " + id);
		  console.log("Value: " + value);
		  console.log("Time received: "+time);
		  
		  var sensor = {"id":id, "value":value, "time":time};
		  console.log(sensor);
		  var sensorString = JSON.stringify(sensor);
		  console.log(sensorString);
		  postSensor(sensorString);
		
		  
	  });
	  
	  socket.end();

});

//server.listen(process.argv[2]);
server.listen(5000);