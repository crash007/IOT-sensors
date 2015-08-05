/**
 * New node file
 */

// DOM Ready =============================================================
$(document).ready(function() {

    $(document).on('click','#photoSensorDropdown .dropdown-menu li',function(e){
    	var selSensor = $(this).text().trim();    	
    	var sensorId = $(this).find('input[name="id"]').val();
    	console.log("Selecting sensor:"+selSensor);
    	
    	//console.log( sensorId);
    	$(this).parents('.btn-group').find('.dropdown-toggle').html(selSensor+' <span class="caret"></span>');
    	
    	//Set hidden sensorId in photo post    	
    	$('#photo-post-form input[name="sensorId"]').val(sensorId)
    	loadPhotos(sensorId);
    	
    });
    
    $(document).on('click','.remove-photo',function(e){
		var filename = $(this).attr('id');
		console.log(filename);
		
		$.getJSON( '/photos/del/'+filename, function( data ) {
			var sensorId = $(document).find('#photo-post-form input[name="sensorId"]').val();
			loadPhotos(sensorId);
		});		
	});
    
    $('form#photo-post-form').submit(function(e){
    	console.log("click on submit");
    	console.log();
    	var formData = new FormData($(this)[0]);
    	e.preventDefault();
    	uploadPhotos(formData);
    });

});


function loadPhotos(sensorId){
	console.log("Loading photos for sensor: "+sensorId);
	$.getJSON( '/photos/sensor/'+sensorId, function( data ) {
		$('.photos-container').html('');
		data.forEach(function(filename){
			console.log(filename);
			$('.photos-container').append('<div class="img-thumbnail"><li><img style="height:225px;" src="/photos/photo/'+filename+'"/></li><li><a class="remove-photo" id="'+filename+'" href="#">Remove</a></li> </div>');
			
		})

	});
}


function uploadPhotos(formData){
	
	var errorCount = 0;
	$('#photo-post-form input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });
	console.log($(this));
	 
	console.log(formData);
	if(errorCount === 0){
		
		// Use AJAX to post the object to our adduser service
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
            	var sensorId = $(document).find('#photo-post-form input[name="sensorId"]').val();
    			loadPhotos(sensorId);
            }
            else {
                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response);
            }
        });
	}else{
		// If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
	}
}
