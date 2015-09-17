/**
 * New node file
 */

var Twitter = require('twitter');
var util = require('util');
 
var client = new Twitter({
  consumer_key: 'BCJWMxjw6xWbXXDgr1JMDNCO8',
  consumer_secret: 'p1DrgLTj5Bzzjr0oVGF2kFdr06h4SUEg0v3O0K9O3wUvXfp0o5',
  access_token_key: '3664249289-IL0sznmfnLuBflPt7CazQkHMHEcQZTwld6U19wz',
  access_token_secret: 'ctUXbmIWmGohlw3rwfXR7N3GgZv4Sezs5Hrf6uQxGLiX8'
});
 

client.post('statuses/update', {status: 'Nodejs application tweet test @watterpellin'},  function(error, tweet, response){
  if(error){ 
	  console.log("Throwing error");
	  console.log(error);
	  throw error;
  }
  console.log(JSON.stringify(tweet));  // Tweet body. 
  console.log(JSON.stringify(response));  // Raw response object. 
});

//var params = {screen_name: 'nodejs'};
//client.get('statuses/user_timeline', params, function(error, tweets, response){
//  if (!error) {
//    console.log(tweets);
//  }
//});