var express = require('express');
var router = express.Router();
var async = require('async');

/*
 * GET users listing.
 */

function getUser(db,username,callback){
	
	 var collection = db.get('users');
	 collection.findOne({'username':username},{fields: {_id:0, password:0}},callback);
		
}

function getSensors(db,username,callback){
	var collection = db.get('sensor-data');
	 collection.find({'username':username}, {fields: {_id:0}},callback);
	
}

module.exports = function(){

	router.get('/',function(req, res){
	
		console.log("queryin db for users");
		var db = req.db;
	    var collection = db.get('users');
	    collection.find({},{fields: {username:1,_id:0}},function(e,docs){
	    	console.log(docs);
	    	res.render('users',{  users: docs, user:req.user});
	    });
	});
	
	router.get('/:username',function(req, res){
		
		console.log("queryin db for user: "+req.params.username);
		var db = req.db;
	    
		async.parallel({
			sensors: async.apply(getSensors,db,req.params.username),
		    selectedUser: async.apply(getUser,db,req.params.username)
		    
		  }, function (error, results) {
		    if (error) {
		      res.status(500).send(error);
		      return;
		    }
		    console.log(results);
		    if(results.selectedUser===null){
		    	console.log("Selected user is empty");
		    }else{
		    	results.selectedUser.sensors = results.sensors;
		    }
		    res.render('user',{selectedUser: results.selectedUser,user:req.user});
		  });
	});
	
	router.get('/list',function(req, res){
		
	console.log("queryin db for users");
	 var db = req.db;
	    var collection = db.get('users');
	    collection.find({},{fields: {password:0, _id:0}},function(e,docs){
	    	console.log(docs);
	        res.json(docs);
	    });
	});
	
	
	return router;
}();