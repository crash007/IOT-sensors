/**
 * New node file
 */
var $ = require('jquery');


function shouldTriggerAction(lastValue,reaction){

	if(reaction.when === 'EVERY_TIME' || reaction.when === 'FIRST_TIME' && reaction.triggered === false){
		console.log('inside');
		console.log(reaction.condition);
		console.log(lastValue);
		console.log(reaction.value);
		if(reaction.condition === 'LESS_THAN' && lastValue < reaction.value){
			return true;
		}
		
		if(reaction.condition === 'LESS_THAN_EQ' && lastValue <= reaction.value){
			return true;
		}
		
		if(reaction.condition === 'GREATER_THAN_EQ' && lastValue >= reaction.value){
			return true;
		}
		
		if(reaction.condition === 'GREATER_THAN' && lastValue > reaction.value){
			return true;
		}
		
	}
	
	console.log('should not trigger action');
	
	return false;
}

function processTwitter(twitterTriggers){
	console.log("processTwitter");
	console.log(twitterTriggers);	
}

function triggerReactionHandler(db,sensorId){
	
		console.log('triggerEventHandler called');
		var collection = db.get('sensor-data');
		
		collection.findOne({_id:sensorId},{fields:{trigger_reactions:1,last_data:1}},function(e,result){
			
			console.log("result:");
			//console.log(result);
			//console.log(result.trigger_reactions);
			if(result!=null && result.trigger_reactions!=null)
			result.trigger_reactions.forEach(function(reaction){
				//console.log(reaction);
				if(shouldTriggerAction(result.last_data.value,reaction)){
					console.log('Will trigger action for reaction:');
					console.log(reaction);
				}
			})
			
		});			
}

module.exports.triggerReactionHandler = triggerReactionHandler;

