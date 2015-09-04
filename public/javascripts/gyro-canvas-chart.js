/**
 * New node file
 */

function chart(){
var dps = [{x: 1, y: 10}, {x: 2, y: 13}, {x: 3, y: 18}, {x: 4, y: 20}, {x: 5, y: 17},{x: 6, y: 10}, {x: 7, y: 13}, {x: 8, y: 18}, {x: 9, y: 20}, {x: 10, y: 17}];   //dataPoints. 

      //var chart = new CanvasJS.Chart("gyro-chart",{
     	$("#gyro-chart").CanvasJSChart({ //Pass chart options
		data: [
		    {
			type: "line", 
			dataPoints: []		
		    },
		     {
			type: "line", 
			dataPoints: []		
		    },
		    
		]
		
	});
}
    
    

$( document ).ready(function() {
	chart();


	io = io.connect()
	 console.log("sending ready");
	 io.emit('ready');
	 
	// Listen for the talk event.
	 io.on('talk', function(data) {
	     //alert(data.message);
	 })

    var i=0;
    var NZEROS= 2;
    var NPOLES=2
    var GAIN=3.414213562;
    var xv=[NZEROS+1], yv=[NPOLES+1];
    xv[0]=0;
    xv[1]=16000;
    xv[2]=0;
    yv[0]=0;
    yv[1]=0;
    yv[2]=0;
    
	 io.on('data', function(data) {
	     
	     xv[0] = xv[1]; xv[1] = xv[2];
	     xv[2] = data / GAIN;
	     yv[0] = yv[1]; yv[1] = yv[2]; 
             yv[2] = (xv[0] + xv[2]) + 2 * xv[1]
                     + ( -0.1715728753 * yv[0]) + (  0.0000000000 * yv[1]);
	     console.log(yv)
	     var chart = $('#gyro-chart').CanvasJSChart();
	     
	     len = chart.options.data[1].dataPoints.length;
	     chart.options.data[0].dataPoints.push({ y: data,x:i });
	     chart.options.data[1].dataPoints.push({ y: yv[2],x:i });

	     if(len > 500){
		 //console.log(chart.options.data[0].dataPoints);
		 chart.options.data[0].dataPoints.shift();
		 chart.options.data[1].dataPoints.shift();
	     }
	     chart.render();
	     i++;
	     

	 })  

	
});




// Use a named immediately-invoked function expression.
function updateGraph() {	
	$.getJSON( '/sensor/'+chartName+'/json/', function( sensor ) {
        
    	console.log($('#'+sensor._id).highcharts());
    	
    	var chart = $('#'+sensor._id).highcharts();
        chart.series[0].setData(timeValueArray(sensor.data));
            
        setTimeout(updateGraph, 2000);
    });
	
}	
  

