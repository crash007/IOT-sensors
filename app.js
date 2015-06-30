
/**
 * Module dependencies.
 */

var express = require('express')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser') 
  , http = require('http')
  , path = require('path')
  
  , sensors = require('./routes/sensors')
  
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

	var favicon = require('serve-favicon');

//Database
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/my-node-project');

var app = express();


//passport.serializeUser(function(user, done) {
//  done(null, user);
//});
//
//passport.deserializeUser(function(user, done) {
//  done(null, user);
//});


// all environments
app.use(express.static(path.join(__dirname, 'public')));
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(logger('combined'));
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(methodOverride('X-HTTP-Method-Override'));  
app.use(session({secret: '5upernovaMAN54321', saveUninitialized: true, resave: true}));
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


var initPassport = require('./passport/init');
initPassport(passport,db);
var routes = require('./routes/index')(passport);
app.use('/', routes);

//var users = require('./routes/user'); 
//app.use('/', users);

var sensors = require('./routes/sensors');
app.use('/sensors', sensors);
//app.get('/charts', charts.charts);
//app.get('/sensors/data', sensors.sensordata);
//app.get('/sensors/sensor-list', sensors.sensorList);
//app.get('/edit/sensors', edit.sensors);
//app.get('/edit/data', edit.data);
//app.post('/edit/add-sensor', edit.addSensor);
//app.post('/edit/edit-sensor', edit.editSensor);
//app.post('/edit/add-data', edit.addData);
//app.post('/edit/edit-data', edit.editData);
//app.post('/edit/del-sensor', edit.delSensor);
//app.post('/edit/del-data', edit.delData);

var edit = require('./routes/edit');
app.use('/edit', edit);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
