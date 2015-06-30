var LocalStrategy   = require('passport-local').Strategy;

var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){
	
	passport.use('signup', new LocalStrategy({
	    passReqToCallback : true
	  },
	  function(req, username, password, done) {
	    findOrCreateUser = function(){
	    	var collection = req.db.get('userlist');
	      collection.findOne({'username':username},function(err, user) {
	        // In case of any error return
	        if (err){
	          console.log('Error in SignUp: '+err);
	          return done(err);
	        }
	        // already exists
	        if (user) {
	          console.log('User already exists');
	          return done(null, false, 
	             req.flash('error','User Already Exists'));
	        } else {
	          // if there is no user with that email
	          // create the user
	          console.log(req.param('email'));
	          console.log(req.param('fullname'));
	        	var newUser = {};
	          // set the user's local credentials
	          newUser.username = username;
	          newUser.password = createHash(password);
	          newUser.email = req.param('email');
	          newUser.fullName = req.param('fullName');
	          newUser.about = req.param('about');
	 
	          	// save the user
	          
	          	collection.insert(newUser,function(err,result) {
	                if (err){
	                  console.log('Error in Saving user: '+err);  
	                  throw err;  
	                }
	                console.log('User Registration succesful');    
	                return done(null, newUser);
	              });
	        }
	      });
	    };
	     
	  //Generates hash using bCrypt
		var createHash = function(password){
		    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
		}
	    // Delay the execution of findOrCreateUser and execute 
	    // the method in the next tick of the event loop
	    process.nextTick(findOrCreateUser);
	  })
		
	);
}