// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var config = require('./config');

var http = require('http');
// configuration ===========================================
    
// config files
//var db = require('./config/db');

var appEnv = {
	config: config
	//, knex: knex
};
// set our port
var port = process.env.PORT || 8080; 

// connect to our mongoDB database 
// (uncomment after you enter in your own credentials in config/db.js)
 //mongoose.connect(db.url); 

// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json()); 

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override')); 

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public')); 

// routes ==================================================
require('./app/routes')(app , appEnv); // configure our routes


// start app ===============================================
// startup our app at http://localhost:8080
//app.listen(port);               


var socket = require("./app/routes/comment_sockets");

var server = http.createServer(app);
var io = require('socket.io').listen(server);  //pass a http.Server instance

io.sockets.on('connection', socket);

//server.listen(8080);
server.listen(process.env.PORT || 8080, function(){
  console.log('listening on port ' +port);
});

// shoutout to the user                     
console.log('Listening On port : ' + port);

// expose app           
exports = module.exports = app;   //testing on docker
