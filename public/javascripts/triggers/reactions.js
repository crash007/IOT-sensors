/**
 * 
 */

$(document).ready(function(){

	if($('#action').val() =='ACTION_TWITTER'){			
		$('#twitter-action-options').show();
	}
		
	$("#action").change(function(a,b){
		console.log("changed action");
		console.log($(this).val());
		$('.action-option').hide();
		if($(this).val() =='ACTION_TWITTER'){
			$('#twitter-action-options').show();
		}		
	});
	
	$('#trigger-submit-btn').click(function(e){
		e.preventDefault();
		console.log($('#trigger-form').serialize());		
		var trigger = $('#triggerForm').serialize();
		console.log(trigger);
		
	    $.ajax({
	        type: 'POST',
	        data: trigger,
	        url: '/triggers/add',
	        dataType: 'JSON'
	    }).done(function( response ) {
	
	        // Check for successful (blank) response
	        if (response.status === 'success') {
	            // Update the table
	           console.log("success");
	           $('#trigger-success-status').fadeIn(600);
            	$('#trigger-success-status').fadeOut(3000);
	
	        }
	        else {
	            // If something goes wrong, alert the error message that our service returned
	            alert('Error: ' + response.message);
	        }
	    });	
		
	});
	
	$('#trigger-remove-btn').click(function(e){
		e.preventDefault();
		var triggerName = $('#trigger-name').val()
		console.log($('#trigger-name').val());
		
		$.ajax({
	        type: 'POST',
	        data: {triggerName: triggerName},
	        url: '/triggers/reaction/remove',
	        dataType: 'JSON'
	    }).done(function( response ) {
	
	        // Check for successful (blank) response
	        if (response.status === 'success') {
	            // Update the table
	           console.log("success");
	          window.location.replace("/triggers");
	
	        }
	        else {
	            // If something goes wrong, alert the error message that our service returned
	            alert('Error: ' + response.message);
	        }
	    });	
	});
	
});
