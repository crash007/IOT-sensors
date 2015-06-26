
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
  , jQuery = require('jquery'),
  methodOverride = require('method-override'),
  session = require('express-session'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  TwitterStrategy = require('passport-twitter'),
  GoogleStrategy = require('passport-google'),
  FacebookStrategy = require('passport-facebook');


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


passport.use(new LocalStrategy(
  function(username, password, done) {
   console.log("passport! username:"+username);
    process.nextTick(function () {
    	var collection = db.get('userlist');
        collection.find({'username': username},{},function(e,docs){
            if(typeof docs[0].password !== 'undefined' && docs[0].password === password){
            	console.log("Returning user:");
            	console.log(docs[0]);
            	return done(null,docs[0]);
            }else{
            	return done(null,false);
            }
        	
        	console.log(docs[0].password);
        });
//	  UserDetails.findOne({'username':username},
//		function(err, user) {
//			if (err) { return done(err); }
//			if (!user) { return done(null, false); }
//			if (user.password != password) { return done(null, false); }
//			return done(null, user);
//		});
    });
  }
));


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

app.post('/login', passport.authenticate('local', { 
  successRedirect: '/profile',
  failureRedirect: '/signin'
  })
);

app.get('/signin', routes.signin);
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
