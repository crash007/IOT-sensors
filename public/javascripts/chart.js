/**
 * New node file
 */
 Highcharts.setOptions({
        global: {
            timezoneOffset: -2 * 60
        }
    });

function chart(sensor){		
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
	    	  valueSuffix: sensor.valueSuffix
	      },
	      series: [{
	          name: sensor.name,
	          data: timeValueArray(sensor.data)
	      }]
	  });
}



// Use a named immediately-invoked function expression.
function updateGraph(chartName,timeSpan) {	
	var url = '/sensor/'+chartName+'/json/'+timeSpan;
	$.getJSON( url, function( sensor ) {
        if(typeof sensor._id !=='undefined'){
	    	//console.log($('#'+sensor._id).highcharts());	    	
	    	var chart = $('#'+sensor._id).highcharts();
	        chart.series[0].setData(timeValueArray(sensor.data));
	        $('a.timeSpan').removeClass('active');
	    	$('a[name="'+timeSpan+'"]').addClass('active');
        }else{
        	alert('No data found');
        }
//        setTimeout(updateGraph, 2000);
    });	
}	
//  
//
function timeValueArray(data){
	var result =[];
	console.log(data);
	if(typeof data!== 'undefined'){
		data.forEach(function(item){
	
			result.push([new Date(item.time).getTime(), item.value]);
		});
		result.sort(sortByDate);
	}
	return result;
}

function sortByDate(a,b){	
	return ((a[0] < b[0]) ? -1 : ((a[0] > b[0]) ? 1 : 0));
}


