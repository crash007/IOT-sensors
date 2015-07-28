
// Fill table with sensors
function populateMySensorsTable() {

	var url = '/sensors/json?mySensors=true';
	
    // Empty content string
    var tableContent = '';
    var dropDownContent='';
    
    // jQuery AJAX call for JSON    
    $.getJSON( url, function( data ) {
    
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';          
            tableContent += '<td class="name">'+this.name+'</td>';
            tableContent += '<td class="description">'+this.description+'</td>';
            tableContent += '<td class="unit">' + this.unit + '</td>';
            tableContent += '<td class="valueSuffix">' + this.valueSuffix + '</td>';                   
            tableContent += '<td class="latLng">' + this.latLng + '</td>';
            tableContent += '<td class="id">' + this._id + '</td>';            
            tableContent += '<td> <a href="#"> <span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a> <a href="#"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a> </td>'; 
            tableContent += '<input type="hidden" name="id" value="'+this._id +'" />';
            tableContent += '</tr>';
            
            dropDownContent += '<li><a href="#">'+this.name+'</a><input type="hidden" name="id" value="'+this._id +'" /></li> ';
            
        });

        // Inject the whole content string into our existing HTML table
        $('#sensorList table tbody').html(tableContent);
        console.log("Populating dropdown");
        $('#sensorDropdown ul').html(dropDownContent);
        
    });
};

//Fill table with sensors
function populateSensorsPageTable(query) {

	var url = '/sensors/json';
	
    // Empty content string
    var tableContent = '';
    
    
    // jQuery AJAX call for JSON    
    $.getJSON( url, query,function( data ) {    	
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td class="name"><a href="/sensor/'+this.name+'">'+this.name+'</a></td>';
            //tableContent += '<td class="name">'+this.name+'</td>';
            tableContent += '<td class="description">'+this.description+'</td>';
            tableContent += '<td class="user"><a href="/sensors?username='+this.username+'">'+this.username+'</a></td>';
            tableContent += '<td class="chart"><a href="/sensor/'+this.name+'/chart/">chart</a></td>';
            tableContent += '<td class="json"><a href="/sensor/'+this.name+'/json/">json</a></td>';
            tableContent += '</tr>';
          
            
        });

        // Inject the whole content string into our existing HTML table
        $('#sensorList table tbody').html(tableContent);
        
        
    });
};