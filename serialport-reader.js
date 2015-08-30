/**
 * New node file
 */

var uploadSensor = require("./modules/upload-sensor");
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;

var device = process.argv[2];
var serialPort = new SerialPort(device, {
  baudrate: 9600,
  parser: serialport.parsers.readline("\n")
  
}, false); // this is the openImmediately flag [default is true]

serialPort.open(function (error) {
  if ( error ) {
    console.log('failed to open: '+error);
  } else {
    console.log('open');
    serialPort.on('data', function(data) {
      console.log("Date: "+new Date()+" , Message: "+data);
	if(data.indexOf("c")>=0){
		console.log("");     
	} 
if (data.indexOf("Temperature") >= 0){
    	  
    	  uploadSensor.uploadSensor("558a6d697e97b3d558847bdc",data.split(':')[1]);  
      }
      
      if (data.indexOf("Humidity") >= 0){
    	  
    	  uploadSensor.uploadSensor("558a734c7e97b3d558847bde",data.split(':')[1]);  
      }  
      
    });
  }
});
