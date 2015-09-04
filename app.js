
/**
 * Module dependencies.
 */

var express = require('express.io')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser') 
  , http = require('http')
  , path = require('path')
  , sensors = require('./routes/sensors')
  , sensor = require('./routes/sensor')
  , edit = require('./routes/edit')
  , users = require('./routes/users')
  , photos = require('./routes/photos')
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
var SerialPort = require("serialport").SerialPort;

//Database
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/my-node-project');

var app = express();

app.http().io();

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

app.io.route('ready', function(req) {
	req.io.emit('talk', {
	        message: 'io event from an io route on the server'
	    })

	var serialport = new SerialPort("/dev/ttyUSB0",{
		  baudrate: 115200,
		  parser: require("serialport").parsers.readline("\n")
	}); // replace this address with your port address
	
	 	  
		serialport.on('open', function(){
		  // Now server is connected to Arduino
		  console.log('Serial Port Opend');
	
		      serialport.on('data', function(data){
		    	  //console.log(data);
		    	  
		              req.io.emit('data', parseFloat(data.split(/\s+/)[0]));
		      });
		  
		});

	
});

var initPassport = require('./passport/init');
initPassport(passport,db);
var routes = require('./routes/index')(passport);
app.use('/', routes);
app.use('/sensors', sensors);
app.use('/sensor', sensor);
app.use('/edit', edit);
app.use('/users', users);
app.use('/photos',photos)

app.listen(3000);

/*
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


*/
