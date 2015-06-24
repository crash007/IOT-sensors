
/*
 * GET users listing.
 */

exports.list = function(req, res){
  //res.send("respond with a resource");
 var db = req.db;
    var collection = db.get('userlist');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
};

exports.userlist = function(req, res){
	  //res.send("respond with a resource");
	 var db = req.db;
	    var collection = db.get('userlist');
	    collection.find({username: 'test1'},{},function(e,docs){
	        res.json(docs);
	    });
	};