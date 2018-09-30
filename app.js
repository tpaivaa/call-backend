"use strict";
// add requires
let express = require('express');
let bodyParser = require('body-parser');
let routes = require('./routes');
let sinch = require('./routes/sinch');
const siptestkey = process.env.siptestkey || '';
const siptestsecret = process.env.siptestsecret || '';
let helpers = require('./helpers');

//set up an app
let app = express();
//configure on what port express will create your app
let port = process.env.PORT || 5000;

function logResponseBody(req, res, next) {
// intercept all requests and set response type to json, and log it for debug 
  res.setHeader('Content-Type', 'application/json');
  //console.log(JSON.stringify(req.body, null, 2));
  helpers.logger.log('info',JSON.stringify(req.body, null, 2));
  next();
}

//congigure body parsing for the app, 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logResponseBody);

app.use('/', routes); 
//add the sinch route 
app.use('/sinch', sinch);
 
//add default content type for all requests
app.use(function (req, res, next) {
  res.setHeader("Content-Type","application/json");
  next();
});
//export and start listening
module.exports = app;
app.listen(port);