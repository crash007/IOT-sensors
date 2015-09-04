/**
 * New node file
 */

function setupChart(){
    
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
    setupChart();

    var chart = $('#gyro-chart').CanvasJSChart();
    var run = false;

    io = io.connect();
    console.log("sending ready");
    run =true;
    io.emit('ready');
	 


    var i=0;
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
    
	 io.on('data', function(data) {
	     
/*	     xv[0] = xv[1]; xv[1] = xv[2];
	     xv[2] = data / GAIN;
	     yv[0] = yv[1]; yv[1] = yv[2]; 
             yv[2] = (xv[0] + xv[2]) + 2 * xv[1]
                     + ( -0.1715728753 * yv[0]) + (  0.0000000000 * yv[1]);
	     console.log(yv) */

	     if(run ===true){
		 console.log(data);
			 var len = chart.options.data[0].dataPoints.length;
			 chart.options.data[0].dataPoints.push({ y: data,x:i });
			 //	     chart.options.data[1].dataPoints.push({ y: yv[2],x:i });
	
			 if(len > 400){
			     //console.log(chart.options.data[0].dataPoints);
			     chart.options.data[0].dataPoints.shift();
			     //		 chart.options.data[1].dataPoints.shift();
			 }
			 chart.render();
			 i++;
	     }

	 });  

	
});





  

