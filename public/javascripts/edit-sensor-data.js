/**
 * New node file
 */
// Userlist data array for filling in info box
var sensorData = [];
var sensorDate = new Date();

// DOM Ready =============================================================
$(document).ready(function() {

	$('#datetimepicker1').datetimepicker({

		locale:'sv',
		format: 'YYYY-MM-DD LTS',
		 defaultDate: new Date(),
    });
	
	$("#datetimepicker1").on("dp.change", function (e) {		  
		console.log(e.date.toDate());
		sensorDate = e.date.toDate();		
    });
	
    // Populate the user table on initial page load
	populateDropdown();
	// populateDataTable();
	
    $('#btnAddSensorData').on('click', addSensorData);    
    
    $(document).on('click','#sensorDropdown .dropdown-menu li',function(e){
    	var selSensor = $(this).text().trim();
    	var id = $(this).find('input').val();
    	console.log(selSensor);
    	console.log($(this).find('input[name="id"]')[0] );
    	$(this).parents('.btn-group').find('.dropdown-toggle').html(selSensor+' <span class="caret"></span>'+$(this).find('input[name="id"]')[0].outerHTML);
    	populateDataTable();
    });
    
    $(document).on('click','#sensorDataList .glyphicon-edit',function(e){    	    	
    	var tr = $(this).parents('tr');
    	editDataRow(tr);
    });
    
    $(document).on('click','#sensorDataList .glyphicon-ok',function(e){   
    	var tr = $(this).parents('tr');    	
    	saveDataChange(tr)
    	//populateDataTable();
    });
    
    $(document).on('click','#sensorDataList .glyphicon-remove',function(e){   
    	var tr = $(this).parents('tr');    	
    	delData(tr);
    	
    });

});

// Functions =============================================================

function editDataRow(tr){
	
	var tableContent = ''; 
	tableContent += '<tr class="edit">';          
	tableContent += '<td class="time"><input type="text" class="form-control" value="'+$(tr).find('.time').text()+'"></td>';
	tableContent += '<td class="value"><input type="text" class="form-control" value="'+$(tr).find('.value').text()+'"> </td>';    
    tableContent += '<td> <a href="#"> <span class="glyphicon glyphicon-ok" aria-hidden="true"></span></a> <a href="#"><span class="glyphicon glyphicon-remove undo" aria-hidden="true"></span></a> </td>'; 
    tableContent += '<input type="hidden" name="prevValue" value="'+$(tr).find('.value').text() +'"/>';
    tableContent += '<input type="hidden" name="prevTime" value="'+$(tr).find('.time').text() +'"/>';
    tableContent += '</tr>';
    
    $(tr).replaceWith(tableContent);
}

// Fill table with sensors
function populateDataTable() {

    // Empty content string
    var tableContent = '';
    
    var id =$('#sensorDropdown .dropdown-toggle input[name="id"]').val();;
    // jQuery AJAX call for JSON
    $.getJSON( '/sensors/json?mySensors=true&_id='+id, function( data ) {
    	console.log(data);
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data[0].data, function(){
        	//console.log(this);
            tableContent += '<tr>';          
            tableContent += '<td class="time">'+this.time+'</td>';
            tableContent += '<td class="value">'+this.value+'</td>';                        
            tableContent += '<td> <a href="#"> <span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a> <a href="#"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a> </td>'; 
            //tableContent += '<input type="hidden" name="id" value="'+this._id +'" />';
            tableContent += '</tr>';
            
        });

        // Inject the whole content string into our existing HTML table
        $('#sensorDataList table tbody').html(tableContent);        
        
    });
};


function populateDropdown(){
	var dropDownContent='';
	$.getJSON( '/sensors/json?mySensors=true', function( data ) {

	        // For each item in our JSON, add a table row and cells to the content string
	        $.each(data, function(){
	            dropDownContent += '<li><a href="#">'+this.name+'</a><input type="hidden" name="id" value="'+this._id +'" /></li> ';
	        });

	        // Inject the whole content string into our existing HTML table	        
	        $('#sensorDropdown ul').html(dropDownContent);
	        
	    });
}

function addSensorData(event){
	
	var errorCount = 0;
	$('#addSensorData input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });
	
	if(errorCount === 0){
		//var name = $('#sensorDropdown .dropdown-toggle').text().trim();
		var id = $('#sensorDropdown .dropdown-toggle input[name="id"]').val().trim();
		var data = {"sensorId": id,				
				"time": sensorDate,
				"value": $('#inputSensorValue').val()};
		
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
                populateDataTable();

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


function saveDataChange(tr){
	console.log("Saving data change to db.");
	
	var data = {};
	data.id = $('#sensorDropdown .dropdown-toggle input[name="id"]').val();
	data.value = $(tr).find('td.value input').val();
	data.time = $(tr).find('td.time input').val();
	data.prevValue = $(tr).find('input[name="prevValue"]').val();
	data.prevTime = $(tr).find('input[name="prevTime"]').val();
	
	console.log(data);
	
    $.ajax({
        type: 'POST',
        data: data,
        url: '/edit/edit-data',
        dataType: 'JSON'
    }).done(function( response ) {
        // Check for successful (blank) response
        if (response.msg === '') {
           populateDataTable();
        }
        else {
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);
        }
    });	
}


function delData(tr){
	var data = {};
	data.id = $('#sensorDropdown .dropdown-toggle input[name="id"]').val();
	data.value = $(tr).find('.value').text();
	data.time = $(tr).find('.time').text()
	
	console.log("Deleting data");
	console.log(data);

    $.ajax({
        type: 'POST',
        data: data,
        url: '/edit/del-data',
        dataType: 'JSON'
    }).done(function( response ) {

        // Check for successful (blank) response
        if (response.msg === '') {
            // Update the table and dropdown
        	populateDataTable();
        }
        else {
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);
        }
    });	
}
