// server/server.js

// provide a framework to set up our Node.js server
var express = require('express');
var router = require('./routes/routes.js');
var path = require('path');
// manage client sessions on the server
var session = require('express-session');
// parse the incoming requests bodies for the info we are sending
var bodyParser = require('body-parser');
// abstracts away MongoDB boilerplate for a simple Schema solution
var mongoose = require('mongoose');

var app = express();

mongoose.connect('mongodb://atomicview:yF99NOJoYRy6@ds046867.mlab.com:46867/atomicview');

app.set('views', path.join(__dirname, '../client'));
app.use(express.static(path.join(__dirname, '../client')));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(session({
  secret: 'takin the bacon',
  resave: true,
  saveUninitialized: false
}));

app.use('/', router);

module.exports = app;
