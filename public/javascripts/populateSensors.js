
// Fill table with sensors
function populateSensorTable(query) {

    // Empty content string
    var tableContent = '';
    var dropDownContent='';
    
    // jQuery AJAX call for JSON
    $.getJSON( '/sensors/read?'+query, function( data ) {

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';          
            tableContent += '<td class="name">'+this.name+'</td>';
            tableContent += '<td class="description">'+this.description+'</td>';
            tableContent += '<td class="unit">' + this.unit + '</td>';
            tableContent += '<td class="valueSuffix">' + this.valueSuffix + '</td>';
            //tableContent += '<td class="values">' + this.values + '</td>';            
            tableContent += '<td class="id">' + this._id + '</td>';
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