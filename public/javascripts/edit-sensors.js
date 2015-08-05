/**
 * New node file
 */
// Data array for filling in info box
var sensorData = [];
var sensorDate = '';

// DOM Ready =============================================================
$(document).ready(function() {


    $('#btnAddSensor').on('click', addSensor);

    
    $(document).on('click','#sensorList .glyphicon-edit',function(e){    	
    	 
    	var tr = $(this).parents('tr');
    	sensorEditTableRow(tr);
    	
    });
    
    $(document).on('click','#sensorList .glyphicon-ok',function(e){   
    	console.log("Click on save sensor changes");
    	var tr = $(this).parents('tr');    	
    	editSensor(tr);
    	//populateSensorTable();
    });
    
    $(document).on('click','#sensorList .glyphicon-remove',function(){    	
    	var tr = $(this).parents('tr');
    	var id = $(tr).find('input[name="id"]').val();
    	delSensor(id);
    });

});

// Functions =============================================================

function sensorEditTableRow(tr){
	var tableContent = ''; 
	tableContent += '<tr class="edit">';          
    tableContent += '<td class="name"><input type="text" class="form-control" value="'+$(tr).find('.name').text()+'"> </td>';
    tableContent += '<td class="description"><input type="text" class="form-control" value="'+$(tr).find('.description').text()+'"></td>';
    tableContent += '<td class="unit"><input type="text" class="form-control" value="'+ $(tr).find('.unit').text() + '"></td>';
    tableContent += '<td class="valueSuffix"><input type="text" class="form-control" value="'+ $(tr).find('.valueSuffix').text() + '"></td>';
    tableContent += '<td class="latLng"><input type="text" class="form-control" value="' + $(tr).find('.latLng').text() + '"></td>';
    tableContent += '<td> <a href="#"> <span class="glyphicon glyphicon-ok" aria-hidden="true"></span></a> <a href="#"><span class="glyphicon glyphicon-remove undo" aria-hidden="true"></span></a> </td>'; 
    tableContent += '<input type="hidden" name="id" value="'+$(tr).find('input[name="id"]').val() +'" />';
    tableContent += '</tr>';
    
    $(tr).replaceWith(tableContent);
}



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

                // Clear the form inputs
                $('#addSensor input').val('');

                // Update the table
               populateMySensorsTable();

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


function editSensor(tr){
	var sensor = {id: $(tr).find('input[name="id"]').val(), name: $(tr).find('td.name input').val(), description: $(tr).find('td.description input').val(), unit: $(tr).find('td.unit input').val(),valueSuffix: $(tr).find('td.valueSuffix input').val(),
			latLng: $(tr).find('td.latLng input').val()};
	console.log("Saving sensor to db: "+sensor.name);
	console.log(sensor);
	// Use AJAX to post the object to our adduser service
    $.ajax({
        type: 'POST',
        data: sensor,
        url: '/edit/edit-sensor',
        dataType: 'JSON'
    }).done(function( response ) {

        // Check for successful (blank) response
        if (response.status === 'success') {
            // Update the table
           populateMySensorsTable();

        }
        else {
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.message);
        }
    });	
}


function delSensor(id){

	console.log("Deleting sensor: " + id);	
	// Use AJAX to post the object to our adduser service
    $.ajax({
        type: 'POST',
        data: {'id':id},
        url: '/edit/del-sensor',
        dataType: 'JSON'
    }).done(function( response ) {

        // Check for successful (blank) response
        if (response.status === 'success') {
            // Update the table and dropdown
           populateMySensorsTable();

        }
        else {
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.message);
        }
    });	
}