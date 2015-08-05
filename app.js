
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
  
//Database
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/my-node-project');

var app = express();


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
app.use('/sensors', sensors);
app.use('/sensor', sensor);
app.use('/edit', edit);
app.use('/users', users);
app.use('/photos',photos)

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
