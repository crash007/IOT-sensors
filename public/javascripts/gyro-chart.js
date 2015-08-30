/**
 * New node file
 */
 Highcharts.setOptions({
        global: {
            timezoneOffset: -2 * 60
        }
    });

function chart(){		
		$('#gyro-chart').highcharts({
			chart: {
	            zoomType: 'x'
	        },
			title: {
	          text: 'Gyro gy-521',
	          x: -20 //center
	      },
	      subtitle: {
	          text: 'Mäter acceleration med ett gyro.',
	          x: -20
	      },
	      xAxis: {
	            
	            title: {
	                text: 'Measurement'
	            }
	        },
	      yAxis: {
	          title: {
	              text: 'accZ'
	          },
	          plotLines: [{
	              value: 0,
	              width: 1,
	              color: '#808080'
	          }]
	      },
	      tooltip: {
	    	  valueSuffix: 'accZ'
	      },
	      series: [{
	          name: 'AccZ',
	          //data: [1,2,3,4]
	      }]
	  });
}


$( document ).ready(function() {
	chart();
	//updateGraph();
	// Listen for get-feelings event.
	io = io.connect()
	 console.log("sending ready");
	 io.emit('ready');
	 
	// Listen for the talk event.
	 io.on('talk', function(data) {
	     alert(data.message);
	 })

    var i=0;
	 io.on('data', function(data) {
	    // console.log(data);
	     var chart = $('#gyro-chart').highcharts();
	     var len = chart.series[0].data.length;
	     var shift = false;
	     i=i+1;
	     var buff = [];
	     if(i==90){
		 i=0;
		 console.log("adding point, value "+data);
                 chart.series[0].addPoint(data,true,len>20);
		 buff=[];
             }else{
		 buff.push(data);
	     }
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
  

