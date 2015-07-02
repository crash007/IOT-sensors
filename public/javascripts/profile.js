$(document).ready(function() {
	populateSensorTable('mySensors=true');
	
	  $('.list-group-item').on('click',function(e){
		  console.log(e);
		  e.preventDefault();
		    var previous = $(this).closest(".list-group").children(".active");
		    previous.removeClass('active'); // previous list-item
		    $(e.target).addClass('active'); // activated list-item
		    var link = $(e.target).data('link');
		    $('.collapse').removeClass('in');
		   
		     $('.'+link).addClass('in');
		  });
	  
	/*$(document).on('click','.profile-link',function(e){
		console.log('Toggle collapse on profile');
		$('.profile-panel').toggleClass('in');
	});*/
});