$(document).ready(function() {
	populateMySensorsTable();
	
	  $('.list-group-item').on('click',function(e){
//		  console.log(e);
//		  e.preventDefault();
//		    var previous = $(this).closest(".list-group").children(".active");
//		    previous.removeClass('active'); // previous list-item
//		    $(e.target).addClass('active'); // activated list-item
		    var link = $(e.target).data('link');
		    $('.collapse').removeClass('in');
//		   
		     $('.'+link).addClass('in');
		  });
	  
	  $('.profile-panel .glyphicon-edit').click(function(e){
		 console.log('click edit'); 
		 $('.profile-panel').removeClass('in');
		 $('.profile-edit-panel').addClass('in');
	  });

	  $('.profile-edit-panel .glyphicon-ok').click(function(e){
		  e.preventDefault();
		 console.log('post form');
		 var profile = {email: $('input[name="email"]').val(), //password: $('input[name="password"]').val(), 
				 about: $('input[name="about"]').val(), fullName: $('input[name="fullName"]').val()};
		 $.ajax({
			  type: "POST",
			  url: '/update-profile',
			  data: profile,			  
			  dataType: 'JSON',			  
		 }).done(function(response){
			var profile = response.profile;	
			
			$('p.email').html("E-mail: "+profile.email);
			$('p.about').html("About: "+profile.about);
			$('p.fullName').html("Full name :"+profile.fullName);
			
			$('.profile-panel').addClass('in');
			$('.profile-edit-panel').removeClass('in');
		 });
	  });
	  

});
