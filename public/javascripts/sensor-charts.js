/**
 * New node file
 */

function chart(sensor){
	console.log(sensor);	
	  //$('#chart').highcharts({
		$('#'+sensor._id).highcharts({
			chart: {
	            zoomType: 'x'
	        },
			title: {
	          text: sensor.name,
	          x: -20 //center
	      },
	      subtitle: {
	          text: sensor.description,
	          x: -20
	      },
	      xAxis: {
	            type: 'datetime',
	            dateTimeLabelFormats: { // don't display the dummy year
	                month: '%e. %b',
	                year: '%b'
	            },
	            title: {
	                text: 'Date'
	            }
	        },
	      yAxis: {
	          title: {
	              text: sensor.unit
	          },
	          plotLines: [{
	              value: 0,
	              width: 1,
	              color: '#808080'
	          }]
	      },
	      tooltip: {
//	          valueSuffix: '°C'
	    	  valueSuffix: sensor.valueSuffix
	      },
	      legend: {
	          layout: 'vertical',
	          align: 'right',
	          verticalAlign: 'middle',
	          borderWidth: 0
	      },
	      series: [{
	          name: sensor.name,
	          data: timeValueArray(sensor.data)
	      }]
	  });
}


$( document ).ready(function() {
	loadGraphs();
	updateGraphs();
	
});

function loadGraphs(){
	$.getJSON( '/sensors/data', function( data ) {
        $.each(data, function(index,item){
        	//console.log(item._id);        
        	$('.chart-container').append('<div id="'+item._id+'"></div');
        	chart(item);           
        });        
    });
}


// Use a named immediately-invoked function expression.
function updateGraphs() {
	$.getJSON( '/sensors/data', function( data ) {
        $.each(data, function(index,item){
        	console.log($('#'+item._id).highcharts());
        	
        	var chart = $('#'+item._id).highcharts();
            chart.series[0].setData(timeValueArray(item.data));
                
              
        	//console.log(item._id);        
        	//$('.chart-container').append('<div id="'+item._id+'"></div');
        	//chart(item);           
        });    
        setTimeout(updateGraphs, 2000);
    });
	
	
//	$.get('ajax/test.html', function(data) {
//    // Now that we've completed the request schedule the next one.
//    $('.result').html(data);
//    setTimeout(updateGraphs, 2000);
//  });
}	
  

function timeValueArray(data){
	var result =[];
	data.forEach(function(item){
		//console.log(item);
		result.push([new Date(item.time).getTime(), parseFloat(item.value)]);
	});
	result.sort(sortByDate);
	//console.log(result);
	return result;
}

function sortByDate(a,b){	
	return ((a[0] < b[0]) ? -1 : ((a[0] > b[0]) ? 1 : 0));
}
