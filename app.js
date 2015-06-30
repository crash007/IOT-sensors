
/**
 * Module dependencies.
 */

var express = require('express')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , about = require('./routes/about')
  , sensors = require('./routes/sensors')
  , charts = require('./routes/charts')
  , edit = require('./routes/edit')
  , $ = require('jquery')
  , jQuery = require('jquery')
  , bCrypt = require('bcrypt-nodejs'),
  methodOverride = require('method-override'),
  session = require('express-session'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  TwitterStrategy = require('passport-twitter'),
  GoogleStrategy = require('passport-google'),
  FacebookStrategy = require('passport-facebook'),
  
  flash = require('connect-flash');


//Database
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/my-node-project');

var app = express();


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


passport.use('login',new LocalStrategy({passReqToCallback:true},
  function(req,username, password, done) {
   console.log("passport! username:"+username);
    process.nextTick(function () {
    	var collection = db.get('userlist');
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
        var isValidPassword = function(user, password){
            return bCrypt.compareSync(password, user.password);
        }
    });
}));

passport.use('signup', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {
    findOrCreateUser = function(){
    	var collection = db.get('userlist');
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


// all environments
app.use(express.static(path.join(__dirname, 'public')));
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
//app.use(express.logger('dev'));
app.use(logger('combined'));
app.use(cookieParser());
//app.use(express.bodyParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(express.methodOverride());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());



app.use(function(req,res,next){
    req.db = db;
    
    var err = req.session.error,
    msg = req.session.notice,
    success = req.session.success;

	delete req.session.error;
	delete req.session.success;
	delete req.session.notice;
	
	if (err) res.locals.error = err;
	if (msg) res.locals.notice = msg;
	if (success) res.locals.success = success;


    next();
});

app.use(app.router);

	
app.get('/', routes.index);

app.post('/login', passport.authenticate('login', { 
  successRedirect: '/profile',
  failureRedirect: '/signin',
  failureFlash: true
  })
);

app.post('/local-reg', passport.authenticate('signup', {
	successRedirect: '/profile',
	failureRedirect: '/signin',
	failureFlash : true  
}));


app.get('/signin', routes.signin);
app.get('/logout', routes.logout);
app.get('/profile', routes.profile);
app.get('/users', user.list);
app.get('/users/userlist', user.userlist);
app.get('/about', about.about);
app.get('/charts', charts.charts);
app.get('/sensors/data', sensors.sensordata);
app.get('/sensors/sensor-list', sensors.sensorList);
app.get('/edit/sensors', edit.sensors);
app.get('/edit/data', edit.data);
app.post('/edit/add-sensor', edit.addSensor);
app.post('/edit/edit-sensor', edit.editSensor);
app.post('/edit/add-data', edit.addData);
app.post('/edit/edit-data', edit.editData);
app.post('/edit/del-sensor', edit.delSensor);
app.post('/edit/del-data', edit.delData);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
