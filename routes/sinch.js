"use strict";
// add requires
let express = require('express');
let router = express.Router();
let helpers = require('../helpers');

router.post('/', function (req, res, next) {
	helpers.callRouter(req,res,next)
			.then((reply) => {
				//console.log(JSON.stringify(reply));
				helpers.logger.log('info',JSON.stringify(reply));
				res.json(reply);
			})
			.catch((err) => {
				//console.log(err);
				helpers.logger.'error',log(err);
				res.json(helpers.rejectCall);
			});
});


router.post('/addnumber', function (req, res) {
  //your custom api security like an oath bearer token
  //in this tutorials we are going to save the numbers in memory, 
  //in production you prob want to either persist it or use a rediscache or similiar
  helpers.numbers.push(req.body.number);
  res.json({ message: 'Ok', numbers: helpers.numbers });
});

router.get('/getnumbers', function (req, res) {
  res.json({ message: 'Ok', numbers: helpers.numbers });
});





module.exports = router;