// DOM Ready =============================================================
$(document).ready(function() {

    getSensorList();
    
    $('#mainTabs li a').click(function (e) {    	
    		e.preventDefault();
    	  $(this).tab('show');
    	  googleMapsResize($(".map-canvas"));
    	  //google.maps.event.trigger($(".map-canvas"), 'resize');
    });
    
    $(document).on('click','.sensor-tabs a',function(e){ 
    	e.preventDefault();
    	var tabName =$(this).attr('name'); 
    	console.log(tabName);
  	  	$(this).parent().parent().find('.active').removeClass('active');
  	  	$(this).parent().toggleClass('active');
  	  	$(this).parents('.sensor').find('.tab-pane').removeClass('active');
  	  	$(this).parents('.sensor').find('.'+tabName).addClass('active');
  	  	
  	  
  });
    
   
    
    
    $(document).on('click','.sensor-info-form .glyphicon-edit',function(e){ 
    	e.preventDefault();
   	 	var sensor = $(this).parentsUntil('.sensor-info-tab');
   	 	sensor.find('.sensor-form').addClass('edit-mode');
   	 	console.log(sensor);
   	 	sensor.find('.collapse').toggleClass('in');
   	 	sensorEditMode(sensor);
   	 	
    });
    
    
    $(document).on('click','.sensor-info-form .glyphicon-ok',function(e){  
    	e.preventDefault();
   	 	var sensorElem = $(this).parentsUntil('.sensor-info-tab');
   	 	sensorElem.find('.collapse').toggleClass('in');
   	 	sensorElem.find('.sensor-form').removeClass('edit-mode');
	 	saveSensor(sensorElem);
    });
    
   
    
    $(document).on('click','.delete-sensor',function(e){   
    	e.preventDefault();
    	var s = $(this).parents('.sensor');
    	delSensor(s);
    });

});


// Functions ============================================================= 
function getSensorList(){

	var url = '/sensors/json/all?mySensors=true&excludeData=true';
	
	
	$.getJSON( url, function( sensor ) {    
	    // For each item in our JSON, add a table row and cells to the content string
	    $.each(sensor, function(){
	    	console.log(this);
	    	var sensorElem = $('#sensor-template .sensor').clone();
	    	sensorElem.find('.sensor-name').text(this.name);
	    	sensorElem.find('.sensor-description').text(this.description);
	    	sensorElem.find('.sensor-unit').text(this.unit);
	    	sensorElem.find('.sensor-value-suffix').text(this.valueSuffix);
	    	sensorElem.find('.sensor-lat-lng').text(this.latLng);
	    	sensorElem.find('input[name="sensor-id"]').val(this._id);
	    	
	    	initialize(this.latLng,sensorElem.find('.map-canvas')[0]);
	    	initSensorDataTab(sensorElem);
	    	initSensorPhotoTab(sensorElem);
	    	sensorElem.appendTo('#sensors-container');
	    	      	        
	    });		    
	});
}


function saveSensor(sensorElem){
	
	var name = sensorElem.find('.sensor-name').val();	   	 	
 	var description = sensorElem.find('.sensor-description').val();
 	var unit = sensorElem.find('.sensor-unit').val();
 	var valueSuffix = sensorElem.find('.sensor-value-suffix').val();
 	var latLng= sensorElem.find('.sensor-lat-lng').val();
 	var id =sensorElem.find('input[name="sensor-id"]').val();
 	
	var sensor = {id: id, name: name, description: description, unit: unit, valueSuffix: valueSuffix,
			latLng: latLng};
	//console.log("Saving sensor to db: "+sensor.name);
	console.log(sensor);

    $.ajax({
        type: 'POST',
        data: sensor,
        url: '/edit/edit-sensor',
        dataType: 'JSON'
    }).done(function( response ) {

        // Check for successful (blank) response
        if (response.status === 'success') {
            // Update the table
           console.log("success");
          // sensorElem.find('.collapse').toggleClass('in'); 
           sensorStaticMode(sensorElem);

        }
        else {
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.message);
        }
    });	
}



function sensorEditMode(sensor){

	var name = sensor.find('.sensor-name').text();	   	 	
 	var description = sensor.find('.sensor-description').text();
 	var unit = sensor.find('.sensor-unit').text();
 	var valueSuffix = sensor.find('.sensor-value-suffix').text();
 	var latLng= sensor.find('.sensor-lat-lng').text();
   	console.log(name); 	
	 	
	 sensor.find('.sensor-name').replaceWith('<input type="text" class="form-control sensor-name"/>');
	 sensor.find('.sensor-name').val(name);
	 	
	sensor.find('.sensor-description').replaceWith('<textarea rows="4" class="form-control sensor-description"/>');
 	sensor.find('.sensor-description').text(description);
 	
 	sensor.find('.sensor-unit').replaceWith('<input typee="text" class="form-control sensor-unit"/>');
 	sensor.find('.sensor-unit').val(unit);
 	
 	
 	sensor.find('.sensor-value-suffix').replaceWith('<input type="text" class="form-control sensor-value-suffix"/>');
 	sensor.find('.sensor-value-suffix').val(valueSuffix);
 	
 	
 	sensor.find('.sensor-lat-lng').replaceWith('<input type="text" class="form-control sensor-lat-lng"/>');
 	sensor.find('.sensor-lat-lng').val(latLng);
}

function sensorStaticMode(sensorElem){
	
	var name = sensorElem.find('.sensor-name').val();	 
	sensorElem.find('.sensor-name').replaceWith('<div class="form-control-static sensor-name">'+name+'</div>');
	
 	var description = sensorElem.find('.sensor-description').val();
 	sensorElem.find('.sensor-description').replaceWith('<div class="form-control-static sensor-description">'+description+'</div>');
 	
 	var unit = sensorElem.find('.sensor-unit').val();
 	sensorElem.find('.sensor-unit').replaceWith('<div class="form-control-static sensor-unit">'+unit+'</div>');
 	
 	var valueSuffix = sensorElem.find('.sensor-value-suffix').val();
 	sensorElem.find('.sensor-value-suffix').replaceWith('<div class="form-control-static sensor-value-suffix">'+valueSuffix+'</div>');
 	
 	var latLng= sensorElem.find('.sensor-lat-lng').val();
 	sensorElem.find('.sensor-lat-lng').replaceWith('<div class="form-control-static sensor-lat-lng">'+latLng+'</div>');
 	 	
	
}

function initialize(latLng,element) {
	var sensorForm = $(element).parentsUntil('tab-content').find('.sensor-form');
	console.log(sensorForm);
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
	  var map = new google.maps.Map(element, mapOptions);
	
	  var marker = new google.maps.Marker({
	      position: myLatlng,
	      map: map,
	      //title: ''
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

			if(sensorForm.hasClass('edit-mode')){
				placeMarker(event.latLng);
				  console.log(event.latLng);
				  sensorForm.find('.sensor-lat-lng').val(event.latLng.G+','+event.latLng.K);
				  //setInputCoords(event.latLng);

			}
		  //$('#inputSensorLatLng').val(event.latLng.G+','+event.latLng.K);
		});
}

function setInputCoords(cords){
	$('#inputSensorLatLng').val(cords.G+','+cords.K);
}




function delSensor(sensor){
	
	var id = $(sensor).find('input[name="sensor-id"]').val();
	console.log("Deleting sensor: " + id);	
	// Use AJAX to post the object to our adduser service
    $.ajax({
        type: 'POST',
        data: {'id':id},
        url: '/edit/del-sensor',
        dataType: 'JSON'
    }).done(function( response ) {

        // Check for successful (blank) response
        if (response.status === 'success') {
           //remove sensor from dom
        	sensor.fadeOut(1000,function() { $(this).remove(); });
        	

        }
        else {
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.message);
        }
    });	
}

function googleMapsResize(maps){
	$.each(maps,function(i,map){
		//console.log(map);
		google.maps.event.trigger(map, 'resize');
	});
}