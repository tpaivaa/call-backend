"use strict";
// add requires
var express = require('express');
var router = express.Router();
var helpers = require('../helpers');

router.get('/', function (req, res, next) {
	// lets reply something that we are up and running
	helpers.logger.log('info','Some just queried / -> we replied status: running');
	res.json({status: 'running'});
});

module.exports = router;