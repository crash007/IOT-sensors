
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
  , jQuery = require('jquery');

//Database
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/my-node-project');

var app = express();

app.use(function(req,res,next){
    req.db = db;
    next();
});


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
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
