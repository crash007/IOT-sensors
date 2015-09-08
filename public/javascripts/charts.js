

$( document ).ready(function() {
	console.log(timeSpan);
	console.log(this.location);
	$('a[href="' + this.location.pathname + '"]').addClass('active');
	loadGraphs();
	updateGraphs();

	
});

function loadGraphs(){	
	$.getJSON( '/sensors/json/'+timeSpan, function( data ) {
        $.each(data, function(index,item){
        	//console.log(item._id);        
        	$('.chart-container').append('<div class="panel panel-default sensor-panel"><div class="panel-body"><div id="'+item._id+'"></div></div></div>');
        	chart(item);           
        });        
    });
}


// Use a named immediately-invoked function expression.
function updateGraphs() {
	$.getJSON( '/sensors/json/'+timeSpan, function( data ) {
        $.each(data, function(index,item){
            var chart = $('#'+item._id).highcharts();
            chart.series[0].setData(timeValueArray(item.data));          
        });    
        setTimeout(updateGraphs, 2000);
    });
	
}	
