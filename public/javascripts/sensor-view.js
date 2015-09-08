$( document ).ready(function() {
	console.log(chartName);
	loadGraph();
	updateGraph();
	loadPhotosByName(chartName);
	
});

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

function loadPhotosByName(sensorName){
	console.log("Loading photos for sensor: "+sensorName);
	$.getJSON( '/photos/sensor/name/'+sensorName, function( data ) {
		$('.photos-container').html('');
		data.forEach(function(filename){
			console.log(filename);
			$('.photos-container').append('<div class="img-thumbnail"><li><img style="height:225px;" src="/photos/photo/'+filename+'"/></li></div>');
			
		})

	});
}