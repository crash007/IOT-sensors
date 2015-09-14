/**
 * New node file
 */

function initSensorDataTab(sensor){
	$(sensor).find('.datetimepicker').datetimepicker({

		locale:'sv',
		format: 'YYYY-MM-DD LTS',
		 defaultDate: new Date(),
    });
	
	$(sensor).find('.datetimepicker').on("dp.change", function (e) {		  
		console.log(e.date.toDate());
		sensorDate = e.date.toDate();		
    });
	
	var sensorId = $(sensor).find('input[name="sensor-id"]').val();
	var tbody = $(sensor).find('.sensorDataList tbody');
	populateDataTable(sensorId,tbody);
};

$(document).on('click','.btnAddSensorData',addSensorData);

$(document).on('click','.sensorDataList .glyphicon-edit',function(e){    	    	
	var tr = $(this).parents('tr');
	editDataRow(tr);
});


$(document).on('click','.sensorDataList .glyphicon-ok',function(e){   
	var tr = $(this).parents('tr');    	
	var id = $(this).parents('.sensor').find('input[name="sensor-id"]').val();
	var tbody = $(this).parents('tbody');
	saveDataChange(id,tr,tbody)
	
});

$(document).on('click','.sensorDataList .glyphicon-remove',function(e){   
	var tr = $(this).parents('tr');
	var id = $(this).parents('.sensor').find('input[name="sensor-id"]').val();
	var value = $(tr).find('.value').text();
	var time = $(tr).find('.time').text()
	var tbody = $(this).parents('tbody');
	
	delData(id,time,value,tbody);     	
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
function populateDataTable(sensorId,tbody) {

    // Empty content string
    var tableContent = '';
    
    
    // jQuery AJAX call for JSON
    $.getJSON( '/sensors/json/all?mySensors=true&_id='+sensorId, function( data ) {
    	console.log(data);
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data[0].data, function(){
        	//console.log(this);
            tableContent += '<tr>';          
            tableContent += '<td class="time">'+this.time+'</td>';
            tableContent += '<td class="value">'+this.value+'</td>';                        
            tableContent += '<td> <a href="#"> <span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a> <a href="#"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a> </td>';     
            tableContent += '</tr>';
            
        });

        // Inject the whole content string into our existing HTML table
        $(tbody).html(tableContent);        
        
    });
};


function addSensorData(){
	
	
	var form = $(this).parent();
	
	
	var errorCount = 0;
	$(form).find('input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });
	
	if(errorCount === 0){

		var sensorId = $(this).parents('.sensor').find('input[name="sensor-id"]').val();
		var value = parseFloat(form.find('input[name="inputSensorValue"]').val());
		var date = form.find('input[name="inputSensorDate"]').val();
		var tbody = $(this).parents('.sensor').find('.sensorDataList tbody');
		
		var data = {"sensorId": sensorId,				
				"time": date,
				"value": value};
		
		console.log(data);
		// Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: data,
            url: '/edit/add-data',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.status === 'success') {

                // Clear the form inputs
                //$('#addSensorData fieldset input').val('');
            	form.find('input[name="inputSensorValue"]').val('');

                // Update the table               
                populateDataTable(sensorId,tbody);

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


function saveDataChange(sensorId,dataRow,tbody){
	console.log("Saving data change to db.");
	
	var data = {};
	data.id = sensorId;
	data.value = $(dataRow).find('td.value input').val();
	data.time = $(dataRow).find('td.time input').val();
	data.prevValue = $(dataRow).find('input[name="prevValue"]').val();
	data.prevTime = $(dataRow).find('input[name="prevTime"]').val();
	
	console.log(data);
	
    $.ajax({
        type: 'POST',
        data: data,
        url: '/edit/edit-data',
        dataType: 'JSON'
    }).done(function( response ) {
        // Check for successful (blank) response
        if (response.status === 'success') {
           populateDataTable(sensorId,tbody);
        }
        else {
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.message);
        }
    });	
}


function delData(sensorId,time,value,tbody){
	var data = {};
	
	data.id =sensorId;
	data.value=value;
	data.time=time;
	
	
	console.log("Deleting data");
	console.log(data);

    $.ajax({
        type: 'POST',
        data: data,
        url: '/edit/del-data',
        dataType: 'JSON'
    }).done(function( response ) {

        // Check for successful (blank) response
        if (response.status === 'success') {
            // Update the table and dropdown
        	console.log($('input[name="sensor-id"][value="'+sensorId+'"]'));
        	populateDataTable(sensorId, tbody);
        }
        else {
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.message);
        }
    });	
}
