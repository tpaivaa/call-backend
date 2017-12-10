// add requires
var express = require('express');
var bodyParser = require('body-parser');
var router = require('./routes/sinch');
 
//set up an app
var app = express();
//configure on what port express will create your app
var port = process.env.PORT || 5000;

function logResponseBody(req, res, next) {
// intercept all requests and set response type to json, and log it for debug 
  res.setHeader('Content-Type', 'application/json');
  console.log(JSON.stringify(req.body, null, 2));
  next();
}

//congigure body parsing for the app, 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logResponseBody); 
//add the sinch route 
app.use('/sinch', router);
 
//add default content type for all requests
app.use(function (req, res, next) {
  res.setHeader("Content-Type","application/json");
  next();
});
//export and start listening
module.exports = app;
app.listen(port);