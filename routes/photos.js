var express = require('express');
var router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var mongo = require('mongodb');
var Grid = require('gridfs-stream'); 
var fs = require('fs');
var isAuthenticated = require('../modules/isAuthenticated.js').isAuthenticated;

function getPhotosBySensorId(res,sensorId){	
	var db = new mongo.Db('my-node-project', new mongo.Server("localhost", 27017));
	
	db.open(function (err) {
		  if (err)  {
			  console.log("Cannot open db");
			  return handleError(err);
		  }
		  var gfs = Grid(db, mongo);		  
		  gfs.files.find({"metadata.sensorId":sensorId}).toArray(function (err, files) {
		 
	        if (err) {
	            res.json(err);
	        }
	        
	        var result = [];
	        files.forEach(function(e,i,l){		  	        	
	            result.push(e.filename);
	        });
	        res.json(result);
		  });	    	    
	});
}


module.exports = function(){
	router.post('/upload', upload.array('photos', 12), isAuthenticated, function (req, res) {
		  // req.files is array of `photos` files
		  // req.body will contain the text fields, if there were any

			//console.log(req.body) // form fields
			console.log("req.files");
		    console.log(req.files) // form files
		   	   
		    //var filename = req.files.file.name;

		    // create or use an existing mongodb-native db instance
		    var db = new mongo.Db('my-node-project', new mongo.Server("localhost", 27017));
		    
		    db.open(function (err) {
		    	  if (err)  {
		    		  console.log("Cannot open db");
		    		  return handleError(err);
		    	  }
		    	  var gfs = Grid(db, mongo);
	    
		    	  req.files.forEach(function(file){
		    		  console.log("file>>>>>");
		    		  console.log(file);
		    		  var dirname = require('path').dirname(__dirname);
		    		  var path = file.path;
		  		    var type = file.mimetype;
		  		    var filename = file.filename;		  		    
		  		    var read_stream =  fs.createReadStream(dirname + '/' + path);
		  		
		  		    var writestream = gfs.createWriteStream({
		  		        filename: filename,
		  		        metadata : {sensorId : req.body.sensorId, username: req.user.username}
		  		    });
		  		   
		  		    read_stream.pipe(writestream);
		  		    writestream.on('close', function (file) {
		  	        //delete file from temp folder
		  	        fs.unlink(path, function() {
		  	          //res.json(200, file);
		  	          console.log("Deleting file: "+path);
		  	        });
		  	      });
		  		    
	  	    	});   	    
		       
	  	    	res.json({status:'success'});
	    	});
		    	    
		});
		
		router.get('/photo/:id',function(req,res){
		      var pic_id = req.param('id');
		
		      var db = new mongo.Db('my-node-project', new mongo.Server("localhost", 27017));
		
		      db.open(function (err) {
		    	  if (err)  {
		    		  console.log("Cannot open db");
		    		  return handleError(err);
		    	  }
		    	  var gfs = Grid(db, mongo);
		    	
		    	  gfs.files.find({filename: pic_id}).toArray(function (err, files) {
		    	 
		  	        if (err) {
		  	            res.json(err);
		  	        }
		  	        console.log(files);
		  	        if (files.length > 0) {
		  	            var mime = 'image/jpeg';
		  	            res.set('Content-Type', mime);
		  	            var read_stream = gfs.createReadStream({filename: pic_id});
		  	            read_stream.pipe(res);
		  	        } else {
		  	            res.json({status :'error', message : 'File not found'});
		  	        }
		    	  });	    	    
		      });
		});
		
		router.get('/sensor/:id',function(req,res){
			var sensorId = req.param('id');		
			getPhotosBySensorId(res,sensorId);
		});

		router.get('/sensor/name/:name',function(req,res){
		    var sensorName = req.param('name');
		    var db = req.db;
		    var collection = db.get('sensor-data');	    		   
		   	    
		    collection.findOne({'name' : sensorName} ,  {fields :{_id:1} } , function(e,docs){        
		    	console.log("Retriving sensor id for sensor:"+sensorName)
		    	
		    	if(docs === null){
		    		res.json({status: 'failure', message: 'No sensor with name: '+sensorName});
		    	}else{
		    	
			    	var sensorId = docs._id.toString();		    	
			    	getPhotosBySensorId(res,sensorId);
		    	}
		    });
		});
		
		router.get('/del/:filename',isAuthenticated, function(req,res){
		      var filename = req.param('filename');
		
		      var db = new mongo.Db('my-node-project', new mongo.Server("localhost", 27017));
		
		      db.open(function (err) {
		    	  if (err)  {
		    		  console.log("Cannot open db");
		    		  return handleError(err);
		    	  }
		    	  var gfs = Grid(db, mongo);
		    	  
		    	  gfs.remove({filename: filename, "metadata.username":req.user.username}, function (err) {
		    		  if (err) return handleError(err);
		    		  res.json({status : 'success'});
		    		});
		    	  	    	    
		      });
		});
		
		
		router.get('/', function(req, res) {
		  res.render('photos', { user : req.user });
		});
		
		return router;
}();