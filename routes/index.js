// add requires
var express = require('express');
var router = express.Router();
var helpers = require('../helpers');

router.get('/', function (req, res, next) {
	// lets reply something that we are up and running
	res.json({status: 'running'});
});