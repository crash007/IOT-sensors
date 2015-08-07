/**
 * New node file
 */
function success(position) {
  var mapcanvas = document.createElement('div');
  mapcanvas.id = 'mapcontainer';
  mapcanvas.style.height = '400px';
  mapcanvas.style.width = '600px';

  document.querySelector('article').appendChild(mapcanvas);

  var coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  console.log(position);
  var options = {
    zoom: 15,
    center: coords,
    //mapTypeControl: false,
    navigationControlOptions: {
    	//style: google.maps.NavigationControlStyle.SMALL
    },
    //mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("mapcontainer"), options);

  var marker = new google.maps.Marker({
      position: coords,
      map: map,
      draggable:true,
      title:"You are here!"
  });
}




function getCurrentLocation(){
	if (navigator.geolocation) {
	  navigator.geolocation.getCurrentPosition(success);
	} else {
	  error('Geo Location is not supported');
	}

}
