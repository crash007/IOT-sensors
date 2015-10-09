
/**
 * Module dependencies.
 */

var express = require('express')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser') 
  , http = require('http')
  , path = require('path')
  , charts = require('./routes/charts')
  , sensors = require('./routes/sensors')
  , sensor = require('./routes/sensor')
  , edit = require('./routes/edit')
  , users = require('./routes/users')
  , photos = require('./routes/photos')
  , twitter = require('./routes/twitter')
  , triggers = require('./routes/triggers')
  , $ = require('jquery')
  , jQuery = require('jquery')
  , bCrypt = require('bcrypt-nodejs'),
  methodOverride = require('method-override'),
  session = require('express-session'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  flash = require('connect-flash')
  , TwitterStrategy = require('passport-twitter').Strategy
  , env = require('../env.js');
var isAuthenticated = require('./modules/isAuthenticated.js').isAuthenticated;
  
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
app.use(session({secret: '5upernovaMAN54321', saveUninitialized: true, resave: true, cookie: { secure: false }}));
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


var twitterAuthz = new TwitterStrategy({
    consumerKey:  process.env.CONSUMER_KEY
  , consumerSecret: process.env.CONSUMER_SECRET
  // Note `authz`, not `auth`
  , callbackURL: "http://127.0.0.1:3000/authz/twitter/callback"
  // We override the default authentication url with the authorize url
  , userAuthorizationURL: 'https://api.twitter.com/oauth/authorize'
  ,passReqToCallback: true
  },
  function(req, token, tokenSecret, profile, done) {
	
	console.log(profile);  
	var user = req.user;
	user.twitter = {};
	user.twitter.username = profile.username;
	user.twitter.token = token;
	user.twitter.tokenSecret = tokenSecret;
	user.twitter.id = profile.id;

	//update user 
	var collection = req.db.get('users');
	collection.update({_id: user._id}, {$set: {"twitter": user.twitter }}, {w:1}, function(err, result) {
		console.log("Added twitter account to user"+user);
	});
    done(null, req.user);
  }
);

twitterAuthz.name = 'twitterAuthz';

passport.use(twitterAuthz);

var initPassport = require('./passport/init');
initPassport(passport,db);
var routes = require('./routes/index')(passport);
app.use('/', routes);
app.use('/sensors', sensors);
app.use('/sensor', sensor);
app.use('/edit', edit);
app.use('/users', users);
app.use('/photos',photos);
app.use('/charts',charts);
app.use('/twitter',twitter);
app.use('/triggers',triggers);

// We can add these routes after the
app.get('/twitter/authz',isAuthenticated, passport.authenticate('twitterAuthz'));
app.get( '/authz/twitter/callback', passport.authenticate(
    'twitterAuthz'
    // this is just a visual cue for our testing purposes
    // you'd want to change this to some useful page
  , { successRedirect: '/twitter/authz-twitter-success'
    , failureRedirect: 'twitter/autz-twitter-failure'
    }
  )
);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
