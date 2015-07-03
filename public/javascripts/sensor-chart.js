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
	console.log(chartName);
	loadGraph();
	updateGraph();
	
});

function loadGraph(){
	$.getJSON( '/sensors/json/'+chartName, function( sensor){
    	$('.chart-container').append('<div id="'+sensor._id+'"></div');
    	chart(sensor);           
        console.log(sensor);
		
		google.maps.event.addDomListener(window, 'load', initialize(sensor.latLng));
    });
}


// Use a named immediately-invoked function expression.
function updateGraph() {	
	$.getJSON( '/sensors/json/'+chartName, function( sensor ) {
        
    	console.log($('#'+sensor._id).highcharts());
    	
    	var chart = $('#'+sensor._id).highcharts();
        chart.series[0].setData(timeValueArray(sensor.data));
            
        setTimeout(updateGraph, 2000);
    });
	
}	
  

function timeValueArray(data){
	var result =[];
	data.forEach(function(item){

		result.push([new Date(item.time).getTime(), parseFloat(item.value)]);
	});
	result.sort(sortByDate);

	return result;
}

function sortByDate(a,b){	
	return ((a[0] < b[0]) ? -1 : ((a[0] > b[0]) ? 1 : 0));
}


function initialize(latLng) {
	console.log(latLng);
	var lat = latLng.split(',')[0];
	var lng = latLng.split(',')[1];
	lat = parseFloat(lat);
	lng = parseFloat(lng);
	  var myLatlng = new google.maps.LatLng(lat,lng);
	  var mapOptions = {
	    zoom: 15,
	    center: myLatlng
	  }
	  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	
	  var marker = new google.maps.Marker({
	      position: myLatlng,
	      map: map,
	      //title: ''
	  });
	}