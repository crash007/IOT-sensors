$(document).ready(function() {
	$('#add-sensor-tab').click(function(){
	   console.log('add-sensor-tab clicked');
	   getCurrentLocation(); 
	   $('#btnAddSensor').on('click', addSensor);
	});
});

function addSensor(event){
	
	var errorCount = 0;
	$('#addSensor input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });
	
	if(errorCount === 0){		
		var data = {"name": $('#inputSensorName').val(),				
				"description": $('#inputSensorDesc').val(),
				"unit": $('#inputSensorUnit').val(),
				"valueSuffix": $('#inputSensorValueSuffix').val(),
				"latLng":$('#inputSensorLatLng').val(),
				"data":[]};
		
		// Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: data,
            url: '/edit/add-sensor',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.status === 'success') {
            	//$('#sensor-added-succefully').addClass('in');
            	$('#sensor-added-succefully').fadeIn(600);
            	$('#sensor-added-succefully').fadeOut(2000);
                // Clear the form inputs
                $('#addSensor input').val('');

                //Update list of sensors
                $('#sensors-container').children().remove();
                //get sensors and and them to sensors-container                
                getSensorList();
            }
            else {
                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.message);
            }
        });
	}else{
		// If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
	}
}