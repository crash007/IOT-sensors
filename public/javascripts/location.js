/**
 * New node file
 */
function success(position) {

  var coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  setInputCoords(coords);
  
  var options = {
    zoom: 15,
    center: coords,
    mapTypeControl: false,
    navigationControlOptions: {
    	style: google.maps.NavigationControlStyle.SMALL
    },
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("map-canvas"), options);
  
  var marker = new google.maps.Marker({
      position: coords,
      map: map,      
      title:"You are here!"
  });
  
	function placeMarker(location) {
	  if ( marker ) {
	    marker.setPosition(location);
	  } else {
	    marker = new google.maps.Marker({
	      position: location,
	      map: map
	    });
	  }
	}

	google.maps.event.addListener(map, 'click', function(event) {
	  placeMarker(event.latLng);
	  console.log(event.latLng);
	  setInputCoords(event.latLng);
	  //$('#inputSensorLatLng').val(event.latLng.G+','+event.latLng.K);
	});
}

function getCurrentLocation(){
	if (navigator.geolocation) {
	  navigator.geolocation.getCurrentPosition(success);
	} else {
	  error('Geo Location is not supported');
	}

}

function setInputCoords(cords){
	console.log(cords);

	$('#inputSensorLatLng').val(cords.H+','+cords.L);
}


	