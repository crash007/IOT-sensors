$(document).ready(function(){
	
	$('.start-action-option').hide();
	$('.stop-action-option').hide();
	
	if($('#startAction').val() =='ACTION_TWITTER'){			
		$('#twitter-startAction-options').show();
	}
	
	if($('#stopAction').val() =='ACTION_TWITTER'){			
		$('#twitter-stopAction-options').show();
	}
		
	$("#startAction").change(function(a,b){
		console.log("changed action");
		console.log($(this).val());
		$('.start-action-option').hide();
		if($(this).val() =='ACTION_TWITTER'){
			$('#twitter-startAction-options').show();
		}		
	});
	
	$("#stopAction").change(function(a,b){
		console.log("changed action");
		console.log($(this).val());
		$('.stop-action-option').hide();
		if($(this).val() =='ACTION_TWITTER'){
			$('#twitter-stopAction-options').show();
		}		
	});
	
	$('#startDate').datetimepicker({
		locale: 'sv',
		minDate: new Date()
	});
	
	$('#stopDate').datetimepicker({
		locale: 'sv',
		minDate: new Date()
	});

	$("#startDate").on("dp.change", function (e) {
		$('#stopDate').data("DateTimePicker").minDate(e.date);
	});
	
	$("#stopDate").on("dp.change", function (e) {
		$('#startDate').data("DateTimePicker").maxDate(e.date);
	});
});