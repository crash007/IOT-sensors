
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { user : req.user });
};

exports.signin = function(req, res){
	 res.render('signin', { user : req.user, message: req.flash('error') });
};

exports.profile = function(req, res){
  //res.render('profile', { title: 'Express' });
	 res.render('profile', { user : req.user });
};

exports.logout= function(req, res){
  var name = req.user.username;
  console.log("LOGGIN OUT " + req.user.username)
  req.logout();
  res.redirect('/');
  req.session.notice = "You have successfully been logged out " + name + "!";
};




/*exports.localReg = function(req, res){
	  var username = req.body.username;
	  var password = req.body.password;
	  var email = req.body.email;
	  var about = req.body.about;
	  
	  console.log(username);
	  
	  var db = req.db;
	    var collection = db.get('users');
	    collection.find({'username':username},{},function(e,existingUser){
	    	if(existingUser === null){ //No user exists
	    	 var newUser = {username: username, password:password, email:email, about:about};	
	    	}else{
	    		res.render('signin', { user : req.user, message: req.flash('User already exists.') });
	    		
	    	}
	    	
	    	
	    	
	    });
	  
};

*/