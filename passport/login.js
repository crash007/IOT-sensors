
var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){
	passport.use('login',new LocalStrategy({passReqToCallback:true},
		  function(req,username, password, done) {
		   console.log("passport! username:"+username);
		    process.nextTick(function () {
		    	var collection = req.db.get('userlist');
		        collection.findOne({'username': username},{},function(e,user){
		        	if(e){
		        		return done(e);
		        	}
		        	// Username does not exist, log error & redirect back
		            if (!user){
		              console.log('User Not Found with username '+username);
		              return done(null, false, 
		                    req.flash('error', 'User Not found.'));                 
		            }
		            // User exists but wrong password, log the error 
		            if (!isValidPassword(user, password)){
		              console.log('Invalid Password');
		              return done(null, false, 
		                  req.flash('error', 'Invalid Password'));
		            }
		            // User and password both match, return user from 
		            // done method which will be treated like success
		            return done(null, user);
		        	        	
		        });
		        
		    });
	}));
	
	var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    }
}