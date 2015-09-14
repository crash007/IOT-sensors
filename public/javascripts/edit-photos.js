/**
 * New node file
 */
function initSensorPhotoTab(sensor){
	var sensorId = $(sensor).find('input[name="sensor-id"]').val();
	var container =$(sensor).find('.photo-container');
	console.log(container);
	loadPhotos(sensorId,container);
}

    
    $(document).on('click','.remove-photo',function(e){
		var filename = $(this).attr('id');
		console.log(filename);
		console.log($(this).parents('.sensor').find('input[name="sensor-id"]').val());
		
		var sensorId = $(this).parents('.sensor').find('input[name="sensor-id"]').val();
		var container = $(this).parents('.sensor').find('.photo-container');
		$.getJSON( '/photos/del/'+filename, function( data ) {
			
			loadPhotos(sensorId,container);
		});		
	});
    

    $(document).on('click','.btn.upload-photo',function(e){
    	console.log($(this).parent());
    	console.log('upload photo');
    	var form = $(this).parent().parent().find('form');
    	sensorId = $(this).parents('.sensor').find('input[name="sensor-id"]').val();  
    	console.log(form.sensorId);
    	var container = $(this).parent().parent().find('.photo-container');
    	console.log(form);
    	uploadPhotos(sensorId,form,container);
    });



function loadPhotos(sensorId,container){
	console.log("Loading photos for sensor: "+sensorId);
	container.html('');
	$.getJSON( '/photos/sensor/'+sensorId, function( data ) {
		$('.photos-container').html('');
		data.forEach(function(filename){
			console.log(filename);
			$(container).append('<div class="img-thumbnail"><img style="height:225px;" src="/photos/photo/'+filename+'"/><a class="remove-photo" id="'+filename+'" href="#">Remove</a> </div>');
			
		})

	});
}


function uploadPhotos(sensorId,form,container){
		console.log(form);
	// Use AJAX to post the object to our adduser service
	var formData = new FormData(form[0]);
	formData.append('sensorId',sensorId);
	console.log(formData);
    
	$.ajax({
        type: 'POST',
        cache: false,
        contentType: false,
        processData: false,
        data: formData,
        url: '/photos/upload',
        //dataType: 'JSON'
    }).done(function( response ) {

        // Check for successful (blank) response
        if (response.status === 'success') {

			loadPhotos(sensorId,container);
        }
        else {
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response);
        }
    });

}
