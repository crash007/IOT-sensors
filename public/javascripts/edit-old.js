/**
 * New node file
 */
// Userlist data array for filling in info box
var sensorData = [];
var sensorDate = '';

// DOM Ready =============================================================
$(document).ready(function() {

	$('#datetimepicker1').datetimepicker({

		locale:'sv',
		format: 'YYYY-MM-DD LTS'				
    });
	
	$("#datetimepicker1").on("dp.change", function (e) {		  
		console.log(e.date.toDate());
		sensorDate = e.date.toDate();		
    });
	
    // Populate the user table on initial page load
    populateSensorTable();
    $('#btnAddSensor').on('click', addSensor);
    $('#btnAddSensorData').on('click', addSensorData);
    
    
    $(document).on('click','.dropdown-menu li',function(e){
    	var selSensor = $(this).text().trim();
    	var id = $(this).find('input').val();
    	console.log(selSensor);
    	console.log($(this).find('input[name="id"]')[0] );
    	$(this).parents('.btn-group').find('.dropdown-toggle').html(selSensor+' <span class="caret"></span>'+$(this).find('input[name="id"]')[0].outerHTML);
    });
    
    $(document).on('click','#sensorList .glyphicon-edit',function(e){    	
    	 
    	var tr = $(this).parents('tr');
    	
    	var tableContent = ''; 
    	tableContent += '<tr class="edit">';          
        tableContent += '<td class="name"><input type="text" class="form-control" value="'+$(tr).find('.name').text()+'"> </td>';
        tableContent += '<td class="description"><input type="text" class="form-control" value="'+$(tr).find('.description').text()+'"></td>';
        tableContent += '<td class="unit"><input type="text" class="form-control" value="'+ $(tr).find('.unit').text() + '"></td>';
        tableContent += '<td class="values">' + $(tr).find('.values').text() + '</td>';
        tableContent += '<td> <a href="#"> <span class="glyphicon glyphicon-ok" aria-hidden="true"></span></a> <a href="#"><span class="glyphicon glyphicon-remove undo" aria-hidden="true"></span></a> </td>'; 
        tableContent += '<input type="hidden" name="id" value="'+$(tr).find('input[name="id"]').val() +'" />';
        tableContent += '</tr>';
        
        $(tr).replaceWith(tableContent);
    });
    
    $(document).on('click','#sensorList .glyphicon-ok',function(e){   
    	console.log("Saving changes to sensor");
    	var tr = $(this).parents('tr');
    	console.log($(tr).find('td.name input').val());
    	editSensor({sensorId: $(tr).find('input[name="id"]').val(), name: $(tr).find('td.name input').val(), description: $(tr).find('td.description input').val(), unit: $(tr).find('td.unit input').val()});
    	populateSensorTable();
    });

});

// Functions =============================================================



// Fill table with sensors
function populateSensorTable() {

    // Empty content string
    var tableContent = '';
    var dropDownContent='';
    
    // jQuery AJAX call for JSON
    $.getJSON( '/sensors/sensor-list', function( data ) {

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';          
            tableContent += '<td class="name">'+this.name+'</td>';
            tableContent += '<td class="description">'+this.description+'</td>';
            tableContent += '<td class="unit">' + this.unit + '</td>';
            tableContent += '<td class="values">' + this.values + '</td>';
            tableContent += '<td> <a href="#"> <span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a> <a href="#"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a> </td>'; 
            tableContent += '<input type="hidden" name="id" value="'+this._id +'" />';
            tableContent += '</tr>';
            
            dropDownContent += '<li><a href="#">'+this.name+'</a><input type="hidden" name="id" value="'+this._id +'" /></li> ';
            
        });

        // Inject the whole content string into our existing HTML table
        $('#sensorList table tbody').html(tableContent);
        $('#sensorDropdown ul').html(dropDownContent);
        
    });
};

function addSensorData(event){
	
	
	var errorCount = 0;
	$('#addSensorData input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });
	
	if(errorCount === 0){
		var name = $('#addSensorData .dropdown-toggle').text().trim();
		var data = {"name": name,				
				"time": sensorDate,
				"value":$('#inputSensorValue').val()};
		
		console.log(data);
		// Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: data,
            url: '/edit/add-data',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addSensorData fieldset input').val('');

                // Update the table
               // populateSensorTable();

            }
            else {
                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);
            }
        });
	}else{
		// If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
	}
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
				"data":[]};
		
		// Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: data,
            url: '/edit/add-sensor',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addSensor input').val('');

                // Update the table
               populateSensorTable();

            }
            else {
                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);
            }
        });
	}else{
		// If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
	}
}


function editSensor(sensor){
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
        if (response.msg === '') {
            // Update the table and dropdown
           populateSensorTable();

        }
        else {
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);
        }
    });
	
}
