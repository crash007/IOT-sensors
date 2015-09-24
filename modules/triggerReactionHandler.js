/**
 * New node file
 */
var $ = require('jquery');
var Twitter = require('twitter');


function setTriggeredStatus(collection,reaction,status){
	console.log('Updating triggered status for reaction: '+reaction.name+' , to status: '+status);
	collection.update(
		{
			trigger_reactions: { $elemMatch: {name:reaction.name, username:reaction.username}}					
		}, 
		{	$set: {
					"trigger_reactions.$.triggered":status 
			}
		}, 
		{w:1}, 
		function(err, result) {
			if(err){
				console.log(err);
			}
			console.log("Triggered status is updated. result: "+result);
		}
	);
}

function conditionIsFulfilled(lastValue,reaction){
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
		return false;
}

function shouldTriggerAction(lastValue,reaction){
	
	if(reaction.enabled==='on' && (reaction.when === 'EVERY_TIME' || reaction.when === 'FIRST_TIME' && reaction.triggered === false)){
	
		return conditionIsFulfilled(lastValue,reaction);
		
	}
	
	return false;
}

function runTwitterAction(db,reaction){
	console.log("runTwitterAction for reaction: "+reaction.name);
	
	var users = db.get('users');
	var collection = db.get('sensor-data');
	

	users.findOne({username:reaction.username},{fields:{twitter:1,username:1}},function(err,user){
		if(err){
			console.log('error when getting twitter tokens for user: '+reaction.username);
			console.log(err);
			return;
		}

		if(user && user.twitter){
			//Lets tweet
			var client = new Twitter({			
			  consumer_key: process.env.CONSUMER_KEY,
			  consumer_secret: process.env.CONSUMER_SECRET,
			  access_token_key: user.twitter.token,
			  access_token_secret: user.twitter.tokenSecret
			});
			
			console.log("Posting twitter message :"+reaction.twitterMessage+ " ,for twitter user: "+user.twitter.username);
			
			//Set triggered if 'when' is FIRST_TIME
//			if(reaction.when ==='FIRST_TIME'){
//				setTriggeredStatus(collection,reaction,true)
//			}
			
			client.post('statuses/update', {status: reaction.twitterMessage},  function(error, tweet, response){
					
				if(error){
					console.log(error)
				}else{
					console.log(tweet);  // Tweet body. 
					//console.log(response);  // Raw response object.
					
					//Set triggered if 'when' is FIRST_TIME
					if(reaction.when ==='FIRST_TIME'){
						setTriggeredStatus(collection,reaction,true)
					}
				}
			});
			
		}else{
			console.log('No twitter tokens found for user: '+reaction.username);
		}		
	});
	
}

function triggerReactionHandler(db,sensorId){
	
		console.log('triggerEventHandler called');
		var collection = db.get('sensor-data');
		
		collection.findOne({_id:sensorId},{fields:{trigger_reactions:1,last_data:1}},function(e,result){

			if(result!=null && result.trigger_reactions!=null)
			result.trigger_reactions.forEach(function(reaction){

				if(shouldTriggerAction(result.last_data.value,reaction)){
					console.log('Triggering action for reaction: '+reaction.name);
					//console.log(reaction);
					
					if(reaction.action ==='ACTION_TWITTER') {
						runTwitterAction(db,reaction);
					}
				}
				
				//Reset trigger if condition not fulfilled
				if(reaction.when ==='FIRST_TIME' && reaction.triggered===true && !conditionIsFulfilled(result.last_data.value,reaction)){
					setTriggeredStatus(collection,reaction,false);
				}
			});
			
		});			
}

module.exports.triggerReactionHandler = triggerReactionHandler;

