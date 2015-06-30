var express = require('express');
var router = express.Router();
/*
 * GET users listing.
 */
module.exports = function(){

	router.get('/list',function(req, res){
	  //res.send("respond with a resource");
		console.log("queryin db for users");
	 var db = req.db;
	    var collection = db.get('userlist');
	    collection.find({},{},function(e,docs){
	    	console.log(docs);
	        res.json(docs);
	    });
	});
	
	return router;
}();