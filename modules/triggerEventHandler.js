/**
 * New node file
 */
var $ = require('jquery');

function processTwitter(twitterTriggers){
	console.log("processTwitter");
	console.log(twitterTriggers);
	
}

function triggerEventHandler(db,sensorId,data){
	
	
		console.log('triggerEventHandler called');
		var collection =db.get('sensor-data');
		collection.col.aggregate(
	   		 // Start with a $match pipeline which can take advantage of an index and limit documents processed
	   		  { $match : {
	   		    
	   		     
	   		  }},
	   		  { $unwind : "$data" },
	   		  
	   		  { $group:	{_id: '$_id', data: {$last: '$data'}, name: {$first: '$name'},description: {$first: '$description'},unit: {$first: '$unit'}, username: {$first: '$username'}, latLng: {$first: '$latLng'}, valueSuffix: {$first: '$valueSuffix'}}
	   		  },
	   		  function(err,result){
	   			  console.log(result);
	   			  
	   		  }
		   );
		
		collection.findOne({_id:sensorId},{fields:{triggers:1}},function(e,data){
			
			console.log("sensor:");
			console.log(data);
			console.log(data.triggers);
			processTwitter(data.triggers.twitter);
			
		});			
}

module.exports.triggerEventHandler = triggerEventHandler;

