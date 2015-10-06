/**
 * New node file
 */
$(document).ready(function() {
	$('#action-twitter-remove-btn').click(function(e){
		e.preventDefault();
		var row = $(this).parent().parent();
		var twitterUsername = row.find('.username').text().trim();
		
		console.log(twitterUsername);
		
		$.ajax({
	        type: 'POST',
	        data: {twitterUsername: twitterUsername},
	        url: '/twitter/remove',
	        dataType: 'JSON'
	    }).done(function( response ) {
	
	        // Check for successful (blank) response
	        if (response.status === 'success') {
	            // Update the table
	           console.log("success");
	           row.remove();
	
	        }
	        else {
	            // If something goes wrong, alert the error message that our service returned
	            alert('Error: ' + response.message);
	        }
	    });	
	});
});