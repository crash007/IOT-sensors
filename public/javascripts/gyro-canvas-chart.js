/**
 * New node file
 */

function setupChart() {

	$("#gyro-chart").CanvasJSChart({ // Pass chart options
		data : [ 
		        {
		        	type : "line",
		        	dataPoints : []
		        }, {
		        	type : "line",
		        	dataPoints : []
		        },
		 ]
	});
}
    
var sio = io.connect(); 

$( document ).ready(function() {
    setupChart();
   
    

    var NZEROS= 2;
    var NPOLES=2;
    var GAIN=3.414213562;
    var xv=[NZEROS+1], yv=[NPOLES+1];
    xv[0]=0;
    xv[1]=16000;
    xv[2]=0;
    yv[0]=0;
    yv[1]=0;
    yv[2]=0;
    
	
	
});


$('.btn-start').click(function(){
console.log(sio.socket);	
    console.log("emiting ready");
    if(sio.socket.connected){
    	console.log('Already connected');
    	sio.emit('ready');
    }else{
    	console.log('Reconnect');
    	sio.socket.connect();
    	//socket= io.connect();
    	sio.emit('ready');
    }
});

$('.btn-stop').click(function(){
	console.log("Disconnecting socket");
	sio.disconnect();
});

$('.btn-calc').click(function(){
	console.log('calculating');
});

var cnt=0;
var values=[];

sio.on('data', function(data) {

/*	     xv[0] = xv[1]; xv[1] = xv[2];
	     xv[2] = data / GAIN;
	     yv[0] = yv[1]; yv[1] = yv[2]; 
             yv[2] = (xv[0] + xv[2]) + 2 * xv[1]
                     + ( -0.1715728753 * yv[0]) + (  0.0000000000 * yv[1]);
	     console.log(yv) */
     

	 //console.log(data);
	var chart = $('#gyro-chart').CanvasJSChart();
	 var len = chart.options.data[0].dataPoints.length;
	// values.push(data);
	 console.log(data);
	 console.log(cnt);
	 chart.options.data[0].dataPoints.push({ y: parseFloat(data[0]),x:cnt });
	 //	     chart.options.data[1].dataPoints.push({ y: yv[2],x:i });

		 if(len > 200){
		     //console.log(chart.options.data[0].dataPoints);
		     chart.options.data[0].dataPoints.shift();
		     //		 chart.options.data[1].dataPoints.shift();
		 }
		 chart.render();
	 cnt++;
	
 });  
