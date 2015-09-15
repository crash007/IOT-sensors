function initChart(chartName,timeSpan){
	var url='/sensor/'+chartName+'/json/'+timeSpan;
	
	$.getJSON( url, function( sensor){
		console.log($(sensor));
		if(typeof sensor._id !='undefined'){
			$('.chart-container').append('<div id="'+sensor._id+'"></div');    	
	    	chart(sensor);           
	    	google.maps.event.addDomListener(window, 'load', initialize(sensor.latLng));  
	    	$('a.timeSpan').removeClass('active');
	    	$('a[name="'+timeSpan+'"]').addClass('active');
		}else{
			initChart(chartName,'all');
		}
    });	
}

$( document ).ready(function() {
	console.log(chartName);
	
	initChart(chartName,'latest/day');
	
	loadPhotosByName(chartName);
	
	$('a.timeSpan').click(function(e){
		var timeSpan = this.name; 
		updateGraph(chartName,timeSpan);
		//$('a.timeSpan').removeClass('active');
		//$('a[name="'+timeSpan+'"]').addClass('active');
	});
	
});

function initialize(latLng) {
	if(typeof latLng!= 'undefined'){
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
	}else{
		$('#map-canvas').html('<p>Position unknown</p>');
	}
}

function loadPhotosByName(sensorName){
	console.log("Loading photos for sensor: "+sensorName);
	$.getJSON( '/photos/sensor/name/'+sensorName, function( data ) {
		$('.photos-container').html('');
		data.forEach(function(filename){
			console.log(filename);
			$('.photos-container').append('<div class="img-thumbnail"><li><img style="height:25em;" src="/photos/photo/'+filename+'"/></li></div>');			
		})

	});
}