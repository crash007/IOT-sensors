

$( document ).ready(function() {
	console.log(timeSpan);
	console.log(this.location);
	if(typeof timeSpan !=='undefined' && timeSpan!==''){
		$('a[href="' + this.location.pathname + '"]').addClass('active');
		loadGraphs();
		//updateGraphs();
	}else{
		window.location.href = this.location.pathname+'/latest/day';
	}

	
});

function loadGraphs(){	
	$.getJSON( '/sensors/json/'+timeSpan, function( data ) {
        $.each(data, function(index,item){     
        	$('.chart-container').append('<div class="panel panel-default sensor-panel"><div class="panel-body"><div id="'+item._id+'"></div></div></div>');
        	chart(item);           
        });        
    });
}
